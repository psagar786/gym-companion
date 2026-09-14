#!/bin/zsh
set -euo pipefail

asset_dir="${0:A:h}/../assets/exercises"

# Keep the source illustration intact while giving each detail phase its own
# raster frame. The slight orientation changes are intentionally restrained so
# the subject remains readable while setup/movement/return are visibly distinct.
for source in "$asset_dir"/*.png; do
  name="${source:t:r}"
  [[ "$name" == *-phase-setup || "$name" == *-phase-move || "$name" == *-phase-return ]] && continue

  cp "$source" "$asset_dir/${name}-phase-setup.png"
  sips --flip horizontal "$asset_dir/${name}-phase-setup.png" >/dev/null

  cp "$source" "$asset_dir/${name}-phase-move.png"

  cp "$source" "$asset_dir/${name}-phase-return.png"
  sips --rotate 2 "$asset_dir/${name}-phase-return.png" >/dev/null
  sips --resampleHeightWidth 512 512 "$asset_dir/${name}-phase-return.png" >/dev/null
done

echo "Generated detail phase variants for $(find "$asset_dir" -name '*-phase-setup.png' | wc -l | tr -d ' ') source illustrations."
