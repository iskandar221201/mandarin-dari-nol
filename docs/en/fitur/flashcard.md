# Vocabulary Flashcards

Quick drill: see the hanzi, guess the meaning, flip the card. Mark what you know. Missed cards come back around.

<div class="fc-controls">
  <select id="fc-level">
    <option value="0">All levels</option>
    <option value="1">HSK 1</option>
    <option value="2">HSK 2</option>
    <option value="3">HSK 3</option>
  </select>
  <button id="fc-start" type="button">Start</button>
</div>

<div id="fc-area" style="display:none">
  <div class="fc-progress" id="fc-progress"></div>
  <div class="fc-card" id="fc-card">
    <div class="fc-inner" id="fc-inner">
      <div class="fc-front"><div class="fc-hz" id="fc-hz"></div><div class="fc-tap">tap to flip</div></div>
      <div class="fc-back"><div class="fc-py" id="fc-py"></div><div class="fc-id" id="fc-id"></div></div>
    </div>
  </div>
  <div class="fc-actions">
    <button id="fc-no" type="button" class="fc-btn-no">✗ Still learning</button>
    <button id="fc-yes" type="button" class="fc-btn-yes">✓ Got it</button>
  </div>
  <div class="fc-score" id="fc-score"></div>
</div>

<script>
if (typeof window !== "undefined") (function() {
  var DATA = [], deck = [], idx = 0, yes = 0, no = 0, flipped = false;
  var area = document.getElementById('fc-area');

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function show() {
    flipped = false;
    document.getElementById('fc-inner').classList.remove('flipped');
    var w = deck[idx];
    document.getElementById('fc-hz').textContent = w.w;
    document.getElementById('fc-py').textContent = w.p;
    document.getElementById('fc-id').textContent = w.m + ' · HSK ' + w.h;
    document.getElementById('fc-progress').textContent = 'Card ' + (idx + 1) + ' / ' + deck.length;
    document.getElementById('fc-score').textContent = 'Known: ' + yes + ' · Missed: ' + no;
  }
  function next(ok) {
    if (ok) yes++; else { no++; deck.push(deck[idx]); }
    idx++;
    if (idx >= deck.length) {
      area.innerHTML = '<div class="fc-done"><p class="fc-done-big">🎉 Session done!</p>' +
        '<p>Known: <b>' + yes + '</b> · To review: <b>' + no + '</b></p>' +
        '<p><button id="fc-again" type="button">Play again</button></p></div>';
      document.getElementById('fc-again').addEventListener('click', function() { location.reload(); });
      return;
    }
    show();
  }
  document.getElementById('fc-card').addEventListener('click', function() {
    flipped = !flipped;
    document.getElementById('fc-inner').classList.toggle('flipped', flipped);
  });
  document.getElementById('fc-yes').addEventListener('click', function() { next(true); });
  document.getElementById('fc-no').addEventListener('click', function() { next(false); });
  document.getElementById('fc-start').addEventListener('click', function() {
    var lv = parseInt(document.getElementById('fc-level').value, 10);
    var pool = DATA.filter(function(w) { return !lv || w.h === lv; });
    deck = shuffle(pool.slice()).slice(0, 20);
    if (!deck.length) return;
    idx = 0; yes = 0; no = 0;
    area.style.display = '';
    show();
    document.getElementById('fc-start').style.display = 'none';
  });

  fetch('/vocab-data.json').then(function(r) { return r.json(); }).then(function(j) { DATA = j; });
})();
</script>

<style>
.fc-controls { display: flex; gap: 8px; margin: 12px 0; }
.fc-controls select { padding: 10px; border-radius: 10px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); }
#fc-start, #fc-again { padding: 10px 24px; background: #C8102E; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }
.fc-progress { color: var(--vp-c-text-2); margin: 8px 0; }
.fc-card { perspective: 800px; max-width: 420px; margin: 12px 0; cursor: pointer; }
.fc-inner { position: relative; width: 100%; height: 260px; transition: transform .4s; transform-style: preserve-3d; }
.fc-inner.flipped { transform: rotateY(180deg); }
.fc-front, .fc-back { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.fc-front { background: linear-gradient(135deg, #C8102E, #e0243a); color: #fff; }
.fc-back { background: var(--vp-c-bg-soft); border: 2px solid #C8102E; transform: rotateY(180deg); }
.fc-hz { font-size: 4rem; font-weight: 900; }
.fc-tap { opacity: .7; font-size: .85rem; margin-top: 12px; }
.fc-py { font-size: 1.6rem; color: #C8102E; font-weight: 700; }
.fc-id { font-size: 1.2rem; margin-top: 8px; }
.fc-actions { display: flex; gap: 12px; margin: 12px 0; }
.fc-actions button { padding: 12px 24px; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; border: none; }
.fc-btn-no { background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider) !important; }
.fc-btn-yes { background: #2e7d32; color: #fff; }
.fc-score { color: var(--vp-c-text-2); }
.fc-done { text-align: center; padding: 24px; }
.fc-done-big { font-size: 1.8rem; }
</style>
