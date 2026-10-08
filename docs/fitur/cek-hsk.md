# Cek Level HSK

Tempel teks Mandarin di bawah. Tiap kata bakal diwarnai sesuai level HSK-nya, jadi kamu langsung tahu teks ini level berapa dan kata apa yang belum kamu kuasai.

<textarea id="ch-input" rows="4" placeholder="Tempel teks Mandarin di sini, misal: 我昨天去商店买了很多便宜的水果。"></textarea>
<div><button id="ch-go" type="button">Cek level</button></div>

<div class="ch-legend">
  <span class="ch-tag ch-1">HSK 1</span>
  <span class="ch-tag ch-2">HSK 2</span>
  <span class="ch-tag ch-3">HSK 3</span>
  <span class="ch-tag ch-0">Di luar HSK 1–3</span>
</div>

<div id="ch-output"></div>
<div id="ch-stats"></div>

<script>
if (typeof window !== "undefined") (function() {
  var WORDS = [];
  var byWord = {};

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function tokenize(text) {
    var tokens = [], i = 0;
    var maxLen = 4;
    while (i < text.length) {
      var ch = text[i];
      if (/\s/.test(ch)) { tokens.push({t: ch, sp: true}); i++; continue; }
      if (/[，。？！；：、,.?!;:()（）「」『』"“”‘’]/.test(ch)) { tokens.push({t: ch, punct: true}); i++; continue; }
      var found = null;
      for (var l = Math.min(maxLen, text.length - i); l >= 1; l--) {
        var sub = text.substr(i, l);
        if (byWord[sub]) { found = sub; break; }
      }
      if (found) { tokens.push({t: found, w: byWord[found]}); i += found.length; }
      else { tokens.push({t: ch, unknown: true}); i++; }
    }
    return tokens;
  }

  function analyze() {
    var text = document.getElementById('ch-input').value;
    if (!text.trim()) return;
    var tokens = tokenize(text);
    var counts = {1: 0, 2: 0, 3: 0, x: 0};
    var html = tokens.map(function(tk) {
      if (tk.sp) return ' ';
      if (tk.punct) return '<span class="ch-punct">' + esc(tk.t) + '</span>';
      if (tk.w) {
        counts[tk.w.h]++;
        return '<span class="ch-tag ch-' + tk.w.h + '" title="' + esc(tk.w.p) + ' · ' + esc(tk.w.m) + '">' + esc(tk.t) + '</span>';
      }
      counts.x++;
      return '<span class="ch-tag ch-0" title="Di luar HSK 1–3">' + esc(tk.t) + '</span>';
    }).join('');
    document.getElementById('ch-output').innerHTML = '<div class="ch-text">' + html + '</div>';
    var total = counts[1] + counts[2] + counts[3] + counts.x;
    var known = counts[1] + counts[2] + counts[3];
    var pct = total ? Math.round(known / total * 100) : 0;
    var verdict = pct >= 95 ? 'Teks ini nyaman buat kamu. Gas baca! 🎉'
      : pct >= 80 ? 'Sebagian besar kata sudah dikenal. Sedikit tantangan, bagus buat naik level.'
      : 'Masih banyak kata asing. Simpan teks ini buat target nanti, fokus ke level kamu dulu.';
    document.getElementById('ch-stats').innerHTML =
      '<div class="ch-statgrid">' +
      '<div>HSK 1: <b>' + counts[1] + '</b></div>' +
      '<div>HSK 2: <b>' + counts[2] + '</b></div>' +
      '<div>HSK 3: <b>' + counts[3] + '</b></div>' +
      '<div>Asing: <b>' + counts.x + '</b></div>' +
      '<div>Dikenal: <b>' + pct + '%</b></div></div>' +
      '<p class="ch-verdict">' + verdict + '</p>';
  }

  document.getElementById('ch-go').addEventListener('click', analyze);

  fetch('/vocab-data.json').then(function(r) { return r.json(); }).then(function(j) {
    WORDS = j;
    j.forEach(function(w) { if (!byWord[w.w]) byWord[w.w] = w; });
  });
})();
</script>

<style>
#ch-input { width: 100%; max-width: 640px; padding: 12px; font-size: 1.1rem; border: 2px solid #C8102E; border-radius: 12px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-family: inherit; }
#ch-go { margin: 10px 0; padding: 10px 24px; background: #C8102E; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 1rem; }
.ch-legend { margin: 8px 0 16px; display: flex; gap: 8px; flex-wrap: wrap; }
.ch-tag { display: inline-block; padding: 2px 10px; margin: 2px; border-radius: 8px; font-size: 1.15rem; cursor: default; }
.ch-1 { background: #e8f5e9; color: #1b5e20; border-bottom: 3px solid #4caf50; }
.ch-2 { background: #fff8e1; color: #e65100; border-bottom: 3px solid #ff9800; }
.ch-3 { background: #fce4ec; color: #880e4f; border-bottom: 3px solid #e91e63; }
.ch-0 { background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); border-bottom: 3px dashed #999; }
html.dark .ch-1 { background: #1b3a24; color: #a5d6a7; }
html.dark .ch-2 { background: #3a2f1b; color: #ffcc80; }
html.dark .ch-3 { background: #3a1b28; color: #f48fb1; }
.ch-punct { color: var(--vp-c-text-2); }
.ch-text { font-size: 1.4rem; line-height: 2.4; max-width: 680px; }
.ch-statgrid { display: flex; gap: 16px; flex-wrap: wrap; margin: 16px 0 8px; }
.ch-verdict { font-weight: 600; }
</style>
