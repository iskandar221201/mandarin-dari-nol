# Audio pelafalan

MP3 di folder ini **tidak** di-commit via API — file biner diupload manual
via GitHub web (drag & drop folder `audio/` ke `docs/public/`) karena
GitHub App tidak punya izin push file biner.

Cara regenerate: `python3 tools/add-audio.py` (pasang tombol + manifest),
lalu `python3 tools/gen-audio.py` (generate MP3 via TTS voice
`avocado_v2:vd2_exacting_pillar`, `--language zh`).
