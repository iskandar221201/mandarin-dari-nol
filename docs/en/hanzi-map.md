# Hanzi Map

Type **one character** to see every HSK 1–3 word that uses it, grouped by level. Click any other character in a word to jump to its map. Explore like a wiki, spot patterns like a detective.

<div class="hm-stats" id="hm-stats"></div>

<div class="hm-search">
  <input id="hm-input" type="text" maxlength="4" placeholder="Type one character, e.g. 学" autocomplete="off" />
  <button id="hm-go" type="button">Open map</button>
  <button id="hm-random" type="button" title="Random character">🎲</button>
</div>
<div class="hm-hint">Try: <span id="hm-chips"></span></div>
<div class="hm-recent" id="hm-recent" style="display:none">Recently viewed: <span id="hm-recent-chips"></span></div>

<div id="hm-result"></div>

<script setup>
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  var DATA = null;
  var result = document.getElementById('hm-result');
  var input = document.getElementById('hm-input');
  var recent = [];

  try { recent = JSON.parse(localStorage.getItem('hm-recent') || '[]'); } catch (e) { recent = []; }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function saveRecent(ch) {
    recent = [ch].concat(recent.filter(function(c) { return c !== ch; })).slice(0, 8);
    try { localStorage.setItem('hm-recent', JSON.stringify(recent)); } catch (e) {}
    renderRecent();
  }

  function renderRecent() {
    var box = document.getElementById('hm-recent');
    if (!recent.length) { box.style.display = 'none'; return; }
    box.style.display = '';
    document.getElementById('hm-recent-chips').innerHTML = recent.map(function(ch) {
      return '<a href="#' + encodeURIComponent(ch) + '" class="hm-chip hm-chip-recent">' + esc(ch) + '</a>';
    }).join(' ');
  }

  function charLink(ch, focus) {
    if (ch === focus) return '<span class="hm-focus">' + esc(ch) + '</span>';
    return '<a href="#' + encodeURIComponent(ch) + '" class="hm-co" title="Open map ' + esc(ch) + '">' + esc(ch) + '</a>';
  }

  function renderWord(w, focus) {
    var chars = Array.prototype.map.call(w.w, function(ch) { return charLink(ch, focus); }).join('');
    return '<div class="hm-word"><div class="hm-word-hz">' + chars + '</div>' +
      '<div class="hm-word-py">' + esc(w.p) + '</div>' +
      '<div class="hm-word-id">' + esc(w.m) + '</div></div>';
  }

  function render(ch) {
    if (!DATA) { result.innerHTML = '<p class="hm-empty">Loading data...</p>'; return; }
    result.style.opacity = '0';
    setTimeout(function() {
      doRender(ch);
      result.style.opacity = '1';
    }, 120);
  }

  function doRender(ch) {
    var d = DATA[ch];
    if (!d) {
      result.innerHTML = '<div class="hm-empty"><p class="hm-big">' + esc(ch) + '</p>' +
        '<p>This character does not appear in this book’s HSK 1–3 vocabulary.</p>' +
        '<p>Try another character, or see <a href="/kosakata-hsk1">the vocabulary lists</a>.</p></div>';
      return;
    }
    saveRecent(ch);
    var byLevel = {1: [], 2: [], 3: []};
    d.words.forEach(function(w) { byLevel[w.h].push(w); });
    var total = d.words.length;
    var hskBadge = d.hsk ? '<span class="hm-badge">HSK ' + d.hsk + '</span>' : '<span class="hm-badge hm-badge-none">Not an HSK word on its own</span>';

    var html = '<div class="hm-hero"><div class="hm-hero-char">' + esc(ch) + '</div><div class="hm-hero-info">' +
      '<div class="hm-hero-py">' + esc(d.pinyin || '?') + '</div>' +
      '<div>' + hskBadge +
      ' <button id="hm-copy" type="button" class="hm-copy" title="Salin link peta ini">🔗 copy link</button></div>' +
      (d.gloss ? '<div class="hm-hero-gloss">' + esc(d.gloss) + '</div>' : '') +
      '<div class="hm-hero-count">' + total + ' HSK words use ' + esc(ch) + ' · click another character to jump maps</div>' +
      '</div></div>';

    html += '<div class="hm-timeline">';
    [1, 2, 3].forEach(function(lv) {
      var ws = byLevel[lv];
      if (!ws.length) return;
      html += '<div class="hm-level"><div class="hm-level-badge">HSK ' + lv + ' · ' + ws.length + ' words</div>' +
        '<div class="hm-words">' + ws.map(function(w) { return renderWord(w, ch); }).join('') + '</div></div>';
    });
    html += '</div>';
    result.innerHTML = html;

    var copyBtn = document.getElementById('hm-copy');
    if (copyBtn) copyBtn.addEventListener('click', function() {
      var url = location.origin + location.pathname + '#' + encodeURIComponent(ch);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
          copyBtn.textContent = '✅ copied!';
          setTimeout(function() { copyBtn.textContent = '🔗 copy link'; }, 1500);
        });
      }
    });
  }

  function go() {
    var v = input.value.trim();
    if (!v) return;
    location.hash = encodeURIComponent(v.charAt(0));
  }

  function random() {
    var keys = Object.keys(DATA || {});
    if (!keys.length) return;
    location.hash = encodeURIComponent(keys[Math.floor(Math.random() * keys.length)]);
  }

  document.getElementById('hm-go').addEventListener('click', go);
  document.getElementById('hm-random').addEventListener('click', random);
  input.addEventListener('keydown', function(e) { if (e.key === 'Enter') go(); });
  var onHash = function() {
    render(decodeURIComponent(location.hash.slice(1)));
  };
  window.addEventListener('hashchange', onHash);
  onUnmounted(function() { window.removeEventListener('hashchange', onHash); });

  fetch('/hanzi-map-data.json').then(function(r) { return r.json(); }).then(function(j) {
    DATA = j;
    var keys = Object.keys(j);
    var nWords = keys.reduce(function(s, k) { return s + j[k].words.length; }, 0);
    document.getElementById('hm-stats').innerHTML =
      '<div class="hm-stat"><b>' + keys.length + '</b><span>characters</span></div>' +
      '<div class="hm-stat"><b>' + nWords + '</b><span>HSK 1–3 words</span></div>' +
      '<div class="hm-stat"><b>3</b><span>HSK levels</span></div>';
    var popular = ['学','好','人','子','大','中','心','天','生','家','开','电','水','车','手','吃'];
    document.getElementById('hm-chips').innerHTML = popular.map(function(ch) {
      return '<a href="#' + encodeURIComponent(ch) + '" class="hm-chip">' + esc(ch) + '</a>';
    }).join(' ');
    renderRecent();
    var start = decodeURIComponent(location.hash.slice(1));
    render(start || '学');
  }).catch(function() {
    result.innerHTML = '<p class="hm-empty">Failed to load map data.</p>';
  });
})
</script>

<style>
.hm-stats { display: flex; gap: 12px; margin: 16px 0 4px; }
.hm-stat { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 10px 18px; text-align: center; }
.hm-stat b { display: block; font-size: 1.5rem; color: #C8102E; }
.hm-stat span { font-size: .8rem; color: var(--vp-c-text-2); }
.hm-search { display: flex; gap: 8px; margin: 16px 0 8px; max-width: 520px; }
.hm-search input { flex: 1; padding: 10px 14px; font-size: 1.1rem; border: 2px solid #C8102E; border-radius: 10px; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.hm-search button { padding: 10px 18px; background: #C8102E; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }
.hm-search button:hover { filter: brightness(1.1); }
#hm-random { padding: 10px 14px; font-size: 1.2rem; }
.hm-hint { color: var(--vp-c-text-2); margin-bottom: 8px; }
.hm-recent { color: var(--vp-c-text-2); margin-bottom: 16px; font-size: .9rem; }
.hm-chip { display: inline-block; margin: 2px; padding: 4px 10px; background: #222; color: #fff; border-radius: 999px; text-decoration: none; font-size: 1.05rem; transition: transform .15s; }
.hm-chip:hover { background: #C8102E; color: #fff; transform: translateY(-2px); }
.hm-chip-recent { background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); }
#hm-result { transition: opacity .12s ease; }
.hm-hero { display: flex; gap: 20px; align-items: center; margin: 20px 0; padding: 24px; background: linear-gradient(135deg, #C8102E 0%, #e0243a 60%, #f0503c 100%); border-radius: 20px; color: #fff; box-shadow: 0 8px 24px rgba(200,16,46,.25); }
.hm-hero-char { font-size: 4.5rem; font-weight: 900; background: rgba(255,255,255,.15); border: 2px solid rgba(255,255,255,.35); border-radius: 18px; width: 112px; height: 112px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; backdrop-filter: blur(4px); }
.hm-hero-py { font-size: 1.9rem; font-weight: 800; }
.hm-badge { display: inline-block; margin: 6px 0; padding: 3px 12px; background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.5); color: #fff; border-radius: 999px; font-weight: 700; font-size: .85rem; }
.hm-badge-none { opacity: .8; }
.hm-copy { background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.4); color: #fff; border-radius: 999px; padding: 3px 12px; font-size: .85rem; cursor: pointer; }
.hm-copy:hover { background: rgba(255,255,255,.3); }
.hm-hero-gloss { font-size: 1.1rem; margin-top: 4px; opacity: .95; }
.hm-hero-count { font-size: .9rem; margin-top: 6px; opacity: .85; }
.hm-timeline { border-left: 3px solid #C8102E; margin: 8px 0 24px 8px; padding-left: 20px; }
.hm-level { margin-bottom: 24px; position: relative; }
.hm-level::before { content: ''; position: absolute; left: -29px; top: 6px; width: 14px; height: 14px; background: #C8102E; border-radius: 50%; box-shadow: 0 0 0 4px rgba(200,16,46,.15); }
.hm-level-badge { display: inline-block; background: #222; color: #fff; padding: 4px 14px; border-radius: 999px; font-weight: 700; margin-bottom: 12px; }
html.dark .hm-level-badge { background: #e8e8e8; color: #222; }
.hm-words { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
.hm-word { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 10px 12px; transition: transform .15s, box-shadow .15s; }
.hm-word:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,.1); }
.hm-word-hz { font-size: 1.5rem; font-weight: 700; }
.hm-focus { color: #C8102E; }
.hm-co { color: var(--vp-c-text-1); text-decoration: underline dotted; }
.hm-co:hover { color: #C8102E; }
.hm-word-py { color: #C8102E; font-size: .9rem; }
.hm-word-id { color: var(--vp-c-text-2); font-size: .9rem; }
.hm-empty { text-align: center; color: var(--vp-c-text-2); padding: 32px 0; }
.hm-big { font-size: 3rem; }
@media (max-width: 600px) {
  .hm-hero { flex-direction: column; text-align: center; gap: 12px; }
  .hm-stats { flex-wrap: wrap; }
}
</style>
