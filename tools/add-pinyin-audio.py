#!/usr/bin/env python3
"""Tambah audio pelafalan ke tabel pinyin (0.3) & nada (0.3/0.4) di bab-0.

- Tiap initial/final: tombol play di sel tabel, didemokan 1 kata (mis. b -> 波 bō)
- Tiap contoh nada (妈/麻/马/骂/吗) & minimal pair HSK 1: tombol play
Jalankan dari root repo: python3 tools/add-pinyin-audio.py (idempoten)
"""
import json
import pathlib
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
AUDIO = DOCS / "public" / "audio"
AUDIO.mkdir(parents=True, exist_ok=True)
MD = DOCS / "bab-0-persiapan.md"

INITIALS = {"b": "波", "p": "坡", "m": "摸", "f": "发", "d": "大", "t": "他",
            "n": "你", "l": "来", "g": "个", "k": "开", "h": "好", "j": "家",
            "q": "去", "x": "想", "zh": "这", "ch": "吃", "sh": "是", "r": "人",
            "z": "在", "c": "菜", "s": "三", "y": "一", "w": "我"}
FINALS = {"a": "八", "o": "波", "e": "喝", "i": "七", "u": "不", "ü": "去",
          "ai": "开", "ei": "杯", "ui": "水", "ao": "好", "ou": "狗", "iu": "九",
          "ie": "些", "üe": "学", "er": "二", "an": "三", "en": "本", "in": "今",
          "un": "春", "ün": "云", "ang": "上", "eng": "生", "ing": "明", "ong": "中"}
TONES = {"妈": "py-ma1", "麻": "py-ma2", "马": "py-ma3", "骂": "py-ma4", "吗": "py-ma0"}
PAIRS = {"好": "py-hao3", "号": "py-hao4", "大": "py-da4", "打": "py-da3",
         "是": "py-shi4", "十": "py-shi2", "睡": "py-shui4", "水": "py-shui3",
         "和": "py-he2", "喝": "py-he1", "会": "py-hui4", "回": "py-hui2"}


def ascii_name(k):
    return k.replace("ün", "vn").replace("ü", "v")


spec = {}  # filename -> hanzi demo
for k, hz in INITIALS.items():
    spec[f"py-i-{k}"] = hz
for k, hz in FINALS.items():
    spec[f"py-f-{ascii_name(k)}"] = hz
for hz, fn in TONES.items():
    spec[fn] = hz
for hz, fn in PAIRS.items():
    spec[fn] = hz

print(f"total file pinyin: {len(spec)}")


def gen(item):
    fn, hz = item
    out = AUDIO / f"{fn}.mp3"
    if out.exists() and out.stat().st_size > 1000:
        return (fn, True)
    r = subprocess.run(
        ["/opt/hatch/bin/tts", "speak", "--language", "zh",
         "--voice", "avocado_v2:vd2_exacting_pillar",
         "--output", str(out), "--text-stdin"],
        input=hz.encode(), capture_output=True, timeout=120)
    ok = r.returncode == 0 and out.exists() and out.stat().st_size > 1000
    return (fn, ok)


with ThreadPoolExecutor(max_workers=6) as ex:
    res = list(ex.map(gen, spec.items()))
fails = [f for f, ok in res if not ok]
print(f"generate: ok={len(res) - len(fails)} gagal={len(fails)}")
for f in fails:
    print("GAGAL:", f, spec[f])

(ROOT / "tools" / "py-audio.json").write_text(
    json.dumps(spec, ensure_ascii=False, indent=1), encoding="utf-8")

# ---------- edit markdown ----------
BTN = ('<button class="audio-btn audio-btn-inline" data-audio="audio/{f}.mp3"'
       ' aria-label="{label}" title="Dengarkan">'
       '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
       '<path d="M8 5v14l11-7z"/></svg></button>')


def btn(fn, label):
    return BTN.format(f=fn, label=label)


lines = MD.read_text().split("\n")

# 1. tip box sebelum tabel initial
for i, ln in enumerate(lines):
    if ln.strip() == "**Initial** (bunyi pembuka):":
        tip = ("::: tip\n"
               "Klik 🔊 di tiap huruf untuk mendengar bunyinya — setiap bunyi didemokan "
               "dengan satu kata (mis. **b** → 波 **bō**). Untuk initial dan final, "
               "yang penting adalah bunyi pembuka/vokalnya, bukan arti katanya.\n"
               ":::")
        if "Klik 🔊 di tiap huruf" not in "\n".join(lines[max(0, i - 4):i]):
            lines.insert(i, tip)
            lines.insert(i + 1, "")
        break

# 2. tabel initial: region antara "**Initial**" dan "**Final**"
def in_region(lo, hi):
    s = next(i for i, l in enumerate(lines) if lo in l)
    e = next(i for i, l in enumerate(lines) if hi in l)
    return s, e

s, e = in_region("**Initial** (bunyi pembuka):", "**Final** (bunyi vokal):")
for i in range(s, e):
    if "audio-btn" in lines[i]:
        continue
    cells = lines[i].split("|")
    changed = False
    for j, c in enumerate(cells):
        k = c.strip()
        if k in INITIALS and "button" not in c:
            cells[j] = f" {k} " + btn(f"py-i-{k}", f"Dengar bunyi {k}") + " "
            changed = True
    if changed:
        lines[i] = "|".join(cells)

# 3. tabel final: region antara "**Final**" dan "Yang bacaannya"
s, e = in_region("**Final** (bunyi vokal):", 'Yang bacaannya "nggak sesuai dugaan"')
for i in range(s, e):
    if "audio-btn" in lines[i]:
        continue
    cells = lines[i].split("|")
    changed = False
    for j, c in enumerate(cells):
        k = c.strip()
        if k in FINALS and "button" not in c:
            cells[j] = f" {k} " + btn(f"py-f-{ascii_name(k)}", f"Dengar bunyi {k}") + " "
            changed = True
    if changed:
        lines[i] = "|".join(cells)

# 4. tabel nada 0.4: sel Contoh berisi 妈/麻/马/骂/吗
for i, ln in enumerate(lines):
    if ln.startswith("|") and "audio-btn" not in ln:
        for hz, fn in TONES.items():
            if f"| {hz} " in ln or f"|{hz} " in ln:
                lines[i] = ln.replace(hz, hz + " " + btn(fn, f"Dengar nada {hz}"), 1)
                break

# 5. daftar minimal pair ma (0.4): "- 妈 **mā** ..."
for i, ln in enumerate(lines):
    m = re.match(r"^(- (妈|麻|马|骂) \*\*)", ln)
    if m and "audio-btn" not in ln:
        hz = m.group(2)
        lines[i] = ln.replace(m.group(1), m.group(1) + " " + btn(TONES[hz], f"Dengar {hz}"), 1)

# 6. tabel minimal pair HSK 1: sel A/B diawali hanzi pasangan
for i, ln in enumerate(lines):
    if ln.startswith("|") and "audio-btn" not in ln and ("↔" in ln or "nada" in ln):
        cells = ln.split("|")
        changed = False
        for j, c in enumerate(cells):
            m = re.match(r"\s*(好|号|大|打|是|十|睡|水|和|喝|会|回)\b", c)
            if m and "button" not in c:
                hz = m.group(1)
                cells[j] = c.replace(hz, hz + " " + btn(PAIRS[hz], f"Dengar {hz}"), 1)
                changed = True
        if changed:
            lines[i] = "|".join(cells)

MD.write_text("\n".join(lines))
print("bab-0 selesai diedit")
