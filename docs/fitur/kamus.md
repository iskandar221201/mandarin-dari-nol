# Kamus Mini HSK 1–3

Cari 608 kata dari kurikulum ini. Bisa pakai hanzi, pinyin (boleh tanpa nada: `ni` ketemu `nǐ`), atau arti Indonesia.

<div class="km-search">
  <input id="km-input" type="text" placeholder="Cari: hanzi, pinyin, atau arti..." autocomplete="off" />
</div>
<div class="km-filters">
  <button class="km-filter on" data-h="0">Semua</button>
  <button class="km-filter" data-h="1">HSK 1</button>
  <button class="km-filter" data-h="2">HSK 2</button>
  <button class="km-filter" data-bm="1">★ Bookmark</button>
  <button class="km-filter" data-h="3">HSK 3</button>
</div>
<div class="km-count" id="km-count"></div>
<div class="km-results" id="km-results"></div>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  var DATA = [];
  var input = document.getElementById('km-input');
  var results = document.getElementById('km-results');
  var count = document.getElementById('km-count');
  var level = 0, bmOnly = false;
  var BM_KEY = 'km-bookmarks';
  function getBm() { try { return JSON.parse(localStorage.getItem(BM_KEY) || '[]'); } catch (e) { return []; } }
  function setBm(a) { try { localStorage.setItem(BM_KEY, JSON.stringify(a)); } catch (e) {} }
  function isBm(w) { return getBm().indexOf(w) >= 0; }
  function toggleBm(w) {
    var a = getBm(), i = a.indexOf(w);
    if (i >= 0) a.splice(i, 1); else a.push(w);
    setBm(a); search();
  }

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
      if (bmOnly && !isBm(w.w)) return false;
      if (!q) return true;
      return norm(w.w).indexOf(q) >= 0 || norm(w.p).indexOf(q) >= 0 || norm(w.m).toLowerCase().indexOf(q.toLowerCase()) >= 0;
    }).slice(0, 60);
    count.textContent = out.length + (DATA.length ? ' dari ' + DATA.filter(function(w){return !level || w.h===level;}).length + ' kata' : '');
    results.innerHTML = out.map(function(w) {
      return '<div class="km-card"><div class="km-hz">' + esc(w.w) + '</div>' +
        '<div class="km-py">' + esc(w.p) + '</div>' +
        '<div class="km-id">' + esc(w.m) + '</div>' +
        '<div class="km-meta"><span class="km-hsk">HSK ' + w.h + '</span> · ' + esc(w.j) + '</div></div>';
    }).join('') || '<p class="km-empty">Nggak ketemu. Coba kata kunci lain.</p>';
  }

  document.querySelectorAll('.km-filter').forEach(function(b) {
    b.addEventListener('click', function() {
      document.querySelectorAll('.km-filter').forEach(function(x) { x.classList.remove('on'); });
      b.classList.add('on');
      level = parseInt(b.dataset.h, 10);
      bmOnly = false;
      search();
    });
  });
  input.addEventListener('input', search);
  results.addEventListener('click', function(e) {
    var b = e.target.closest('.km-bm');
    if (b) { e.stopPropagation(); toggleBm(b.dataset.w); }
  });
  var bmBtn = document.querySelector('.km-filter[data-bm]');
  if (bmBtn) bmBtn.addEventListener('click', function() {
    document.querySelectorAll('.km-filter').forEach(function(x) { x.classList.remove('on'); });
    bmBtn.classList.add('on');
    bmOnly = true; level = 0; search();
  });

  fetch('/vocab-data.json').then(function(r) { return r.json(); }).then(function(j) {
    DATA = j; search();
  });
})
</script>

<style>
.km-search input { width: 100%; max-width: 520px; padding: 12px 16px; font-size: 1.1rem; border: 2px solid #C8102E; border-radius: 12px; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.km-filters { margin: 12px 0; display: flex; gap: 8px; }
.km-filter { padding: 6px 16px; border-radius: 999px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); cursor: pointer; }
.km-filter.on { background: #C8102E; color: #fff; border-color: #C8102E; }
.km-count { color: var(--vp-c-text-2); font-size: .9rem; margin-bottom: 12px; }
.km-results { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
.km-bm { float: right; border: none; background: none; font-size: 1.15rem; cursor: pointer; color: var(--vp-c-text-2); padding: 0 0 4px 4px; }
.km-bm.on { color: #C8102E; }
.km-card { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 12px; }
.km-hz { font-size: 1.6rem; font-weight: 700; }
.km-py { color: #C8102E; }
.km-id { color: var(--vp-c-text-2); font-size: .9rem; }
.km-meta { font-size: .8rem; color: var(--vp-c-text-2); margin-top: 6px; }
.km-hsk { background: #C8102E; color: #fff; border-radius: 6px; padding: 1px 8px; font-weight: 700; }
.km-empty { color: var(--vp-c-text-2); }
</style>
