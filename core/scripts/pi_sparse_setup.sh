#!/usr/bin/env bash
# Run ONCE on the Pi, inside the cloned repo (e.g. ~/leryai).
# Restricts the working tree to core/ so `git pull` never brings api/, web/, mobile/ or docs.
#
#   cd ~/leryai && bash core/scripts/pi_sparse_setup.sh
#
# Fresh clone alternative (never downloads the other modules' files):
#   git clone --filter=blob:none --no-checkout https://github.com/tlsamaral/leryai.git
#   cd leryai && git sparse-checkout set --no-cone '/core/' && git checkout main
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a git repository. cd into the clone first." >&2
  exit 1
fi
cd "$(git rev-parse --show-toplevel)"

# Sparse checkout only deletes files that are clean; refuse if anything outside core/ is modified.
dirty=$(git status --porcelain --untracked-files=no | awk '{print $2}' | grep -v '^core/' || true)
if [[ -n "$dirty" ]]; then
  echo "Uncommitted changes outside core/ — commit or discard them first:" >&2
  echo "$dirty" >&2
  exit 1
fi

# --no-cone: cone mode would always keep root files (README, biome.json, ...). We want core/ only.
git sparse-checkout set --no-cone '/core/'

echo
echo "Working tree now contains:"
ls -A
echo
echo "From now on a plain 'git pull' only updates core/."
