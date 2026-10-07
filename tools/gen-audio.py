#!/usr/bin/env python3
"""Generate MP3 pelafalan untuk tiap kalimat di audio-manifest.json (yg belum ada).

Jalankan dari root repo: python3 tools/gen-audio.py
"""
import json
import pathlib
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor

ROOT = pathlib.Path(__file__).resolve().parent.parent
manifest = json.loads((ROOT / "tools" / "audio-manifest.json").read_text(encoding="utf-8"))
audio_dir = ROOT / "docs" / "public" / "audio"
audio_dir.mkdir(parents=True, exist_ok=True)

missing = [h for h in manifest if not (audio_dir / f"{h}.mp3").exists()]
print(f"total: {len(manifest)}, perlu generate: {len(missing)}", flush=True)


def gen(h):
    s = manifest[h]
    out = audio_dir / f"{h}.mp3"
    for attempt in range(3):
        try:
            r = subprocess.run(
                ["/opt/hatch/bin/tts", "speak", "--language", "zh",
                 "--voice", "avocado_v2:vd2_exacting_pillar",
                 "--output", str(out), "--text-stdin"],
                input=s.encode("utf-8"), capture_output=True, timeout=180,
            )
            if r.returncode == 0 and out.exists() and out.stat().st_size > 1000:
                return (h, True, "")
        except Exception as e:  # noqa: BLE001
            err = str(e)[:150]
        else:
            err = r.stderr.decode()[:150]
        time.sleep(8)
    return (h, False, err)


done = 0
failed = []
with ThreadPoolExecutor(max_workers=6) as ex:
    for h, ok, err in ex.map(gen, missing):
        done += 1
        if not ok:
            failed.append((h, manifest[h], err))
        if done % 25 == 0:
            print(f"progres: {done}/{len(missing)}", flush=True)

print(f"SELESAI ok={done - len(failed)} gagal={len(failed)}")
for h, s, e in failed:
    print("GAGAL:", h, s, "|", e)
