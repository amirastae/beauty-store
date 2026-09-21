#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "cinematic" / "source"
OUT_DIR = ROOT / "public" / "cinematic"
CLIPS = [SOURCE_DIR / f"clip-{i:02d}.mp4" for i in range(1, 6)]
FADE = 0.30


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd))
    subprocess.run(cmd, check=True)


def probe_duration(path: Path) -> float:
    raw = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "json", str(path)
    ], text=True)
    return float(json.loads(raw)["format"]["duration"])


def require_tools() -> None:
    missing = [name for name in ("ffmpeg", "ffprobe") if shutil.which(name) is None]
    if missing:
        raise SystemExit("Missing required tool(s): " + ", ".join(missing))


def main() -> int:
    parser = argparse.ArgumentParser(description="Assemble FATIKHAN scroll-cinematic hero media")
    parser.add_argument("--all-i", action="store_true", help="Encode every frame as a keyframe for maximum seek precision")
    args = parser.parse_args()

    require_tools()
    missing = [str(p) for p in CLIPS if not p.is_file()]
    if missing:
        print("Missing source clips:", *missing, sep="\n- ", file=sys.stderr)
        return 2

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    durations = [probe_duration(p) for p in CLIPS]
    if any(d <= FADE + 0.5 for d in durations):
        raise SystemExit(f"Every clip must be longer than {FADE + 0.5:.2f}s; got {durations}")

    # Normalize inputs, then chain 0.30s cross dissolves using measured clip lengths.
    filter_parts = []
    for i in range(5):
        filter_parts.append(
            f"[{i}:v]fps=30,scale=1920:1080:force_original_aspect_ratio=increase,"
            f"crop=1920:1080,setsar=1,format=yuv420p[v{i}]"
        )

    cumulative = durations[0]
    prev = "v0"
    for i in range(1, 5):
        offset = cumulative - FADE
        out = f"x{i}"
        filter_parts.append(
            f"[{prev}][v{i}]xfade=transition=fade:duration={FADE:.2f}:offset={offset:.3f}[{out}]"
        )
        cumulative += durations[i] - FADE
        prev = out

    filter_graph = ";".join(filter_parts)
    master = OUT_DIR / "_fatikhan-master.mp4"

    cmd = ["ffmpeg", "-y"]
    for clip in CLIPS:
        cmd += ["-i", str(clip)]
    cmd += [
        "-filter_complex", filter_graph,
        "-map", f"[{prev}]",
        "-an",
        "-r", "30",
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(master),
    ]
    run(cmd)

    keyint = "1" if args.all_i else "30"
    mp4 = OUT_DIR / "fatikhan-hero.mp4"
    webm = OUT_DIR / "fatikhan-hero.webm"
    poster = OUT_DIR / "fatikhan-poster.jpg"

    run([
        "ffmpeg", "-y", "-i", str(master), "-an",
        "-c:v", "libx264", "-preset", "slow", "-crf", "22",
        "-g", keyint, "-keyint_min", keyint, "-sc_threshold", "0",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        str(mp4),
    ])

    run([
        "ffmpeg", "-y", "-i", str(master), "-an",
        "-c:v", "libvpx-vp9", "-crf", "32", "-b:v", "0",
        "-g", keyint, "-row-mt", "1", "-threads", "8",
        str(webm),
    ])

    run([
        "ffmpeg", "-y", "-ss", "0.15", "-i", str(master),
        "-frames:v", "1", "-q:v", "2", str(poster),
    ])

    master.unlink(missing_ok=True)

    print("\nFATIKHAN_CINEMATIC_BUILD=PASS")
    for path in (mp4, webm, poster):
        size = path.stat().st_size
        print(f"{path.relative_to(ROOT)} = {size / (1024 * 1024):.2f} MB")
    if mp4.stat().st_size > 25 * 1024 * 1024:
        print("WARNING: MP4 exceeds the 25 MB target; reduce source duration/bitrate before production.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
