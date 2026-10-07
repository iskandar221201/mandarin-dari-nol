#!/usr/bin/env python3
"""Ekstrak contoh kalimat (.hz) dari tiap bab, pasang tombol audio, tulis manifest TTS.

Jalankan dari root repo: python3 tools/add-audio.py
Idempoten: blok .contoh yang sudah punya audio-btn dilewati.
"""
import hashlib
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
AUDIO_DIR = DOCS / "public" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

BTN = ('<button class="audio-btn" data-audio="audio/{h}.mp3" '
       'aria-label="Dengarkan pelafalan" title="Dengarkan">'
       '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
       '<path d="M8 5v14l11-7z"/></svg></button>')

manifest_path = ROOT / "tools" / "audio-manifest.json"
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}

added, skipped = 0, 0
for md in sorted(DOCS.glob("bab-*.md")):
    t = md.read_text()
    out = []
    pos = 0
    for m in re.finditer(r'<div class="contoh">', t):
        out.append(t[pos:m.end()])
        pos = m.end()
        # ambil jendela ke depan, cari .hz di dalamnya
        window = t[pos:pos+1500]
        if 'audio-btn' in window[:800]:
            skipped += 1
            continue
        hz = re.search(r'<div class="hz">(.*?)</div>', window, re.S)
        if not hz:
            continue
        sentence = hz.group(1).strip()
        h = hashlib.md5(sentence.encode()).hexdigest()[:12]
        manifest[h] = sentence
        out.append(BTN.format(h=h))
        added += 1
    out.append(t[pos:])
    md.write_text(''.join(out))

manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding='utf-8')

missing = [h for h in manifest if not (AUDIO_DIR / f"{h}.mp3").exists()]
print(f"tombol ditambah: {added}, dilewati (sudah ada): {skipped}")
print(f"total kalimat unik: {len(manifest)}, belum ada mp3: {len(missing)}")
pathlib.Path(ROOT / "tools" / "audio-missing.txt").write_text("\n".join(missing))
