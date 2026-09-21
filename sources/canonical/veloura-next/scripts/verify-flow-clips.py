#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "cinematic" / "source"
CLIPS = [SOURCE_DIR / f"clip-{i:02d}.mp4" for i in range(1, 6)]

def require_tool(name: str) -> None:
    if shutil.which(name) is None:
        raise SystemExit(f"Missing required tool: {name}")

def fps_value(raw: str) -> float:
    try:
        return float(Fraction(raw))
    except Exception:
        return 0.0

def probe(path: Path) -> dict:
    raw = subprocess.check_output([
        "ffprobe", "-v", "error",
        "-show_streams", "-show_format",
        "-of", "json", str(path)
    ], text=True)
    return json.loads(raw)

def main() -> int:
    require_tool("ffprobe")
    failures: list[str] = []
    warnings: list[str] = []

    missing = [p.name for p in CLIPS if not p.is_file()]
    if missing:
        failures.append("missing clips: " + ", ".join(missing))

    for path in CLIPS:
        if not path.is_file():
            continue
        if path.stat().st_size < 100_000:
            failures.append(f"{path.name}: file is unexpectedly small ({path.stat().st_size} bytes)")
            continue

        data = probe(path)
        streams = data.get("streams", [])
        video = next((s for s in streams if s.get("codec_type") == "video"), None)
        if not video:
            failures.append(f"{path.name}: no video stream")
            continue

        width = int(video.get("width") or 0)
        height = int(video.get("height") or 0)
        ratio = (width / height) if height else 0
        duration = float((data.get("format") or {}).get("duration") or video.get("duration") or 0)
        fps = fps_value(video.get("avg_frame_rate") or video.get("r_frame_rate") or "0/1")
        audio = any(s.get("codec_type") == "audio" for s in streams)

        if duration < 2.5 or duration > 8.0:
            failures.append(f"{path.name}: duration {duration:.2f}s outside 2.5-8.0s gate")
        elif duration < 3.0 or duration > 5.5:
            warnings.append(f"{path.name}: duration {duration:.2f}s is outside preferred 3.0-5.5s range")

        if width < 1280 or height < 720:
            failures.append(f"{path.name}: resolution {width}x{height} below 1280x720")
        if abs(ratio - (16 / 9)) > 0.04:
            failures.append(f"{path.name}: aspect ratio {ratio:.4f} is not close to 16:9")
        if fps and not 23.0 <= fps <= 61.0:
            warnings.append(f"{path.name}: unusual frame rate {fps:.3f} fps")
        if audio:
            warnings.append(f"{path.name}: contains audio; assembly strips audio")

        print(f"{path.name}: {width}x{height} {duration:.2f}s {fps:.3f}fps audio={audio}")

    for item in warnings:
        print("WARNING:", item)

    if failures:
        for item in failures:
            print("FAIL:", item, file=sys.stderr)
        return 2

    print("FATIKHAN_FLOW_CLIPS=PASS")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
