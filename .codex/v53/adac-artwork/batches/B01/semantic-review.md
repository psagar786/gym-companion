# Batch B01 semantic review

Status: `NEEDS_HUMAN_REVIEW`

The Start and Movement masters preserve the locked row-major mapping and show distinct working states. The crop report contains 49 foreground-margin warnings (49 movement/start tiles across the two boards) because the draft source is 1254×1254 and some subjects approach a cell edge. No byte-identical crops were found and all 50 crops decode as square 512×512 PNGs.

Review queue:

- Inspect every tile at detail-page size for exact mechanics, grip, equipment, and safe margin.
- Individually regenerate any clipped or mechanically ambiguous tile; do not regenerate the full board unless the mapping is lost.
- Keep all assets in review status until a human gym-coach review is completed. Technical review is not qualified coach approval.
