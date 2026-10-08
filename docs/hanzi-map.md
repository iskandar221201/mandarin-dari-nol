# Peta Hanzi

Ketik **satu karakter** dan lihat semua kata HSK 1–3 yang memakainya, dikelompokkan per level. Klik karakter lain di tiap kata buat lompat ke petanya. Jelajah kayak wiki, nemu pola kayak detektif.

<div class="hm-search">
  <input id="hm-input" type="text" maxlength="4" placeholder="Ketik satu karakter, misal 学" autocomplete="off" />
  <button id="hm-go" type="button">Buka peta</button>
</div>
<div class="hm-hint">Coba: <span id="hm-chips"></span></div>

<div id="hm-result"></div>

<script>
if (typeof window !== "undefined") (function() {
  var DATA = null;
  var result = document.getElementById('hm-result');
  var input = document.getElementById('hm-input');

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function charLink(ch, focus) {
    if (ch === focus) return '<span class="hm-focus">' + esc(ch) + '</span>';
    return '<a href="#' + encodeURIComponent(ch) + '" class="hm-co" title="Buka peta ' + esc(ch) + '">' + esc(ch) + '</a>';
  }

  function renderWord(w, focus) {
    var chars = Array.prototype.map.call(w.w, function(ch) { return charLink(ch, focus); }).join('');
    return '<div class="hm-word"><div class="hm-word-hz">' + chars + '</div>' +
      '<div class="hm-word-py">' + esc(w.p) + '</div>' +
      '<div class="hm-word-id">' + esc(w.m) + '</div></div>';
  }

  function render(ch) {
    if (!DATA) { result.innerHTML = '<p class="hm-empty">Memuat data...</p>'; return; }
    var d = DATA[ch];
    if (!d) {
      result.innerHTML = '<div class="hm-empty"><p class="hm-big">' + esc(ch) + '</p>' +
        '<p>Karakter ini nggak muncul di kosakata HSK 1–3 buku ini.</p>' +
        '<p>Coba karakter lain, atau lihat <a href="/kosakata-hsk1">daftar kosakata</a>.</p></div>';
      return;
    }
    var byLevel = {1: [], 2: [], 3: []};
    d.words.forEach(function(w) { byLevel[w.h].push(w); });
    var total = d.words.length;
    var hskBadge = d.hsk ? '<span class="hm-badge">HSK ' + d.hsk + '</span>' : '<span class="hm-badge hm-badge-none">Bukan kata HSK sendiri</span>';

    var html = '<div class="hm-hero"><div class="hm-hero-char">' + esc(ch) + '</div><div class="hm-hero-info">' +
      '<div class="hm-hero-py">' + esc(d.pinyin || '?') + '</div>' +
      '<div>' + hskBadge + '</div>' +
      (d.gloss ? '<div class="hm-hero-gloss">' + esc(d.gloss) + '</div>' : '') +
      '<div class="hm-hero-count">' + total + ' kata HSK memakai ' + esc(ch) + ' · klik karakter lain buat pindah peta</div>' +
      '</div></div>';

    html += '<div class="hm-timeline">';
    [1, 2, 3].forEach(function(lv) {
      var ws = byLevel[lv];
      if (!ws.length) return;
      html += '<div class="hm-level"><div class="hm-level-badge">HSK ' + lv + ' · ' + ws.length + ' kata</div>' +
        '<div class="hm-words">' + ws.map(function(w) { return renderWord(w, ch); }).join('') + '</div></div>';
    });
    html += '</div>';
    result.innerHTML = html;
  }

  function go() {
    var v = input.value.trim();
    if (!v) return;
    var ch = v.charAt(0);
    location.hash = encodeURIComponent(ch);
  }

  document.getElementById('hm-go').addEventListener('click', go);
  input.addEventListener('keydown', function(e) { if (e.key === 'Enter') go(); });
  window.addEventListener('hashchange', function() {
    render(decodeURIComponent(location.hash.slice(1)));
  });

  fetch('/hanzi-map-data.json').then(function(r) { return r.json(); }).then(function(j) {
    DATA = j;
    var popular = ['学','好','人','子','大','中','心','天','生','家','开','电','水','车','手','吃'];
    document.getElementById('hm-chips').innerHTML = popular.map(function(ch) {
      return '<a href="#' + encodeURIComponent(ch) + '" class="hm-chip">' + esc(ch) + '</a>';
    }).join(' ');
    var start = decodeURIComponent(location.hash.slice(1));
    render(start || '学');
  }).catch(function() {
    result.innerHTML = '<p class="hm-empty">Gagal memuat data peta.</p>';
  });
})();
</script>

<style>
.hm-search { display: flex; gap: 8px; margin: 16px 0 8px; max-width: 480px; }
.hm-search input { flex: 1; padding: 10px 14px; font-size: 1.1rem; border: 2px solid #C8102E; border-radius: 10px; }
.hm-search button { padding: 10px 18px; background: #C8102E; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }
.hm-hint { color: #666; margin-bottom: 16px; }
.hm-chip { display: inline-block; margin: 2px; padding: 4px 10px; background: #222; color: #fff; border-radius: 999px; text-decoration: none; font-size: 1.05rem; }
.hm-chip:hover { background: #C8102E; color: #fff; }
.hm-hero { display: flex; gap: 20px; align-items: center; margin: 20px 0; padding: 20px; background: #FFF7F7; border-radius: 16px; border: 1px solid #f0d0d0; }
.hm-hero-char { font-size: 4.5rem; font-weight: 900; color: #fff; background: #C8102E; border-radius: 18px; width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(200,16,46,.25); flex-shrink: 0; }
.hm-hero-py { font-size: 1.8rem; font-weight: 800; }
.hm-badge { display: inline-block; margin: 6px 0; padding: 3px 12px; border: 2px solid #C8102E; color: #C8102E; border-radius: 999px; font-weight: 700; font-size: .85rem; }
.hm-badge-none { border-color: #999; color: #999; }
.hm-hero-gloss { font-size: 1.1rem; margin-top: 4px; }
.hm-hero-count { color: #666; font-size: .9rem; margin-top: 6px; }
.hm-timeline { border-left: 3px solid #C8102E; margin: 8px 0 24px 8px; padding-left: 20px; }
.hm-level { margin-bottom: 24px; position: relative; }
.hm-level::before { content: ''; position: absolute; left: -29px; top: 6px; width: 14px; height: 14px; background: #C8102E; border-radius: 50%; }
.hm-level-badge { display: inline-block; background: #222; color: #fff; padding: 4px 14px; border-radius: 999px; font-weight: 700; margin-bottom: 12px; }
.hm-words { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
.hm-word { background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 10px 12px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
.hm-word-hz { font-size: 1.5rem; font-weight: 700; }
.hm-focus { color: #C8102E; }
.hm-co { color: #333; text-decoration: underline dotted; }
.hm-co:hover { color: #C8102E; }
.hm-word-py { color: #C8102E; font-size: .9rem; }
.hm-word-id { color: #555; font-size: .9rem; }
.hm-empty { text-align: center; color: #666; padding: 32px 0; }
.hm-big { font-size: 3rem; }
</style>
