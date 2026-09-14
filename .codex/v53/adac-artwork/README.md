# ADAC crop agent runbook

Stage 4 tooling treats each supplied `start-master.png` and `movement-master.png` as an immutable 5×5 source. It rejects non-square or unsupported masters, never auto-trims, and records the source SHA-256 so interrupted runs can resume safely.

From the lab root:

```sh
node scripts/validate-adac-master.mjs batches/<batch>
node scripts/crop-adac-batch.mjs --batch <batch>
node scripts/report-adac-crops.mjs batches/<batch>/crops
```

Each tile uses normalized geometry: 2.5% outer margin, 1.25% gutters, then contain-resizes into a 512×512 charcoal (`#232323`) PNG. Output defaults to `batches/<batch>/crops`; raw masters are never replaced. Re-run the crop command after replacing a master; unchanged source hashes are skipped. To opt into the periodized namespace explicitly, pass `--namespace periodized-abc`, which writes `batches/periodized-abc/<batch>/crops`.

The report includes SHA-256, byte sizes, duplicate byte-identical files, and a conservative edge-margin warning for manual review. Warnings do not mutate artwork. Existing V4, V5, and Biweekly assets are outside these paths and are not touched.
