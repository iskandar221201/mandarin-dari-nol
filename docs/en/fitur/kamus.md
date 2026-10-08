# Mini Dictionary HSK 1–3

Search 608 words from this course. Use hanzi, pinyin (toneless works: `ni` finds `nǐ`), or Indonesian meaning.

<div class="km-search">
  <input id="km-input" type="text" placeholder="Search: hanzi, pinyin, or meaning..." autocomplete="off" />
</div>
<div class="km-filters">
  <button class="km-filter on" data-h="0">All</button>
  <button class="km-filter" data-h="1">HSK 1</button>
  <button class="km-filter" data-h="2">HSK 2</button>
  <button class="km-filter" data-h="3">HSK 3</button>
</div>
<div class="km-count" id="km-count"></div>
<div class="km-results" id="km-results"></div>

<script>
if (typeof window !== "undefined") (function() {
  var DATA = [];
  var input = document.getElementById('km-input');
  var results = document.getElementById('km-results');
  var count = document.getElementById('km-count');
  var level = 0;

  var TONE_MAP = {'ā':'a','á':'a','ǎ':'a','à':'a','ē':'e','é':'e','ě':'e','è':'e',
    'ī':'i','í':'i','ǐ':'i','ì':'i','ō':'o','ó':'o','ǒ':'o','ò':'o',
    'ū':'u','ú':'u','ǔ':'u','ù':'u','ǖ':'v','ǘ':'v','ǚ':'v','ǜ':'v','ü':'v'};

  function norm(s) {
    return String(s).toLowerCase().split('').map(function(c) { return TONE_MAP[c] || c; }).join('');
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function search() {
    var q = norm(input.value.trim());
    var out = DATA.filter(function(w) {
      if (level && w.h !== level) return false;
      if (!q) return true;
      return norm(w.w).indexOf(q) >= 0 || norm(w.p).indexOf(q) >= 0 || norm(w.m).toLowerCase().indexOf(q.toLowerCase()) >= 0;
    }).slice(0, 60);
    count.textContent = out.length + (DATA.length ? ' of ' + DATA.filter(function(w){return !level || w.h===level;}).length + ' words' : '');
    results.innerHTML = out.map(function(w) {
      return '<div class="km-card"><div class="km-hz">' + esc(w.w) + '</div>' +
        '<div class="km-py">' + esc(w.p) + '</div>' +
        '<div class="km-id">' + esc(w.m) + '</div>' +
        '<div class="km-meta"><span class="km-hsk">HSK ' + w.h + '</span> · ' + esc(w.j) + '</div></div>';
    }).join('') || '<p class="km-empty">No matches. Try another keyword.</p>';
  }

  document.querySelectorAll('.km-filter').forEach(function(b) {
    b.addEventListener('click', function() {
      document.querySelectorAll('.km-filter').forEach(function(x) { x.classList.remove('on'); });
      b.classList.add('on');
      level = parseInt(b.dataset.h, 10);
      search();
    });
  });
  input.addEventListener('input', search);

  fetch('/vocab-data.json').then(function(r) { return r.json(); }).then(function(j) {
    DATA = j; search();
  });
})();
</script>

<style>
.km-search input { width: 100%; max-width: 520px; padding: 12px 16px; font-size: 1.1rem; border: 2px solid #C8102E; border-radius: 12px; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.km-filters { margin: 12px 0; display: flex; gap: 8px; }
.km-filter { padding: 6px 16px; border-radius: 999px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); cursor: pointer; }
.km-filter.on { background: #C8102E; color: #fff; border-color: #C8102E; }
.km-count { color: var(--vp-c-text-2); font-size: .9rem; margin-bottom: 12px; }
.km-results { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
.km-card { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 12px; }
.km-hz { font-size: 1.6rem; font-weight: 700; }
.km-py { color: #C8102E; }
.km-id { color: var(--vp-c-text-2); font-size: .9rem; }
.km-meta { font-size: .8rem; color: var(--vp-c-text-2); margin-top: 6px; }
.km-hsk { background: #C8102E; color: #fff; border-radius: 6px; padding: 1px 8px; font-weight: 700; }
.km-empty { color: var(--vp-c-text-2); }
</style>
