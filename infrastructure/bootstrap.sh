#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

echo "[commerce-lab] syncing pinned infrastructure submodules"
git submodule sync --recursive
git submodule update --init --recursive --jobs 4

echo "[commerce-lab] verifying pinned SHAs"
git submodule status --recursive

echo "[commerce-lab] complete"
