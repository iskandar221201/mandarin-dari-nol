# Match: HSK 1

Match each hanzi with its meaning. 4 rounds, 5 pairs per round.

<div class="ck-controls">
  <button id="ck-pinyin" type="button" class="ck-toggle on"></button>
  <button id="ck-zen" type="button" class="ck-toggle">🧘 Zen Mode</button>
  <button id="ck-start" type="button">Start</button>
</div>

<div id="ck-area" style="display:none">
  <div class="ck-top"><span id="ck-round"></span><span id="ck-score"></span></div>
  <div class="ck-board">
    <div class="ck-col" id="ck-left"></div>
    <div class="ck-col" id="ck-right"></div>
  </div>
</div>

<div id="ck-done" style="display:none">
  <div class="ck-done"><div id="ck-result"></div><button id="ck-again" type="button">Play again</button></div>
</div>


<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  var LEVEL = 1;
  var DATA = [], session = [], round = 0, selHz = null, correct = 0, mistakes = 0, pinyinOn = true, zen = false;
  var PAIRS = 5, ROUNDS = 4;
  var S = {
    round: 'Round {x} / {n}',
    score: 'Correct: {c} · Missed: {m}',
    pinyin: 'Pinyin',
    doneTitle: '\uD83C\uDF89 Session done!',
    doneStats: 'Matched: <b>{c}</b> · Missed: <b>{m}</b>',
    again: 'Play again'
  };

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function $(id) { return document.getElementById(id); }

  function pickSession(pool) {
    // 20 kata, tiap ronde 5 dengan arti unik
    var picked = [], used = {};
    for (var i = 0; i < pool.length && picked.length < PAIRS * ROUNDS; i++) {
      var w = pool[i];
      var r = Math.floor(picked.length / PAIRS);
      var key = r + '|' + w.m;
      if (!used[key]) { used[key] = 1; picked.push(w); }
    }
    return picked;
  }

  function startGame() {
    var pool = shuffle(DATA.filter(function(w) { return w.h === LEVEL; }).slice());
    session = pickSession(pool);
    if (session.length < PAIRS) return;
    round = 0; correct = 0; mistakes = 0; selHz = null;
    $('ck-area').style.display = '';
    $('ck-done').style.display = 'none';
    $('ck-start').style.display = 'none';
    showRound();
  }

  function showRound() {
    selHz = null;
    var words = session.slice(round * PAIRS, round * PAIRS + PAIRS);
    $('ck-round').textContent = S.round.replace('{x}', round + 1).replace('{n}', ROUNDS);
    updateScore();
    var left = $('ck-left'), right = $('ck-right');
    left.innerHTML = ''; right.innerHTML = '';
    shuffle(words.slice()).forEach(function(w, k) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ck-card ck-hz'; b.dataset.k = words.indexOf(w);
      b.innerHTML = '<span class="ck-py">' + esc(w.p) + '</span><span class="ck-big">' + esc(w.w) + '</span>';
      b.addEventListener('click', function() { onHz(b); });
      left.appendChild(b);
    });
    shuffle(words.slice()).forEach(function(w) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ck-card ck-id'; b.dataset.k = words.indexOf(w);
      b.textContent = w.m;
      b.addEventListener('click', function() { onId(b, w); });
      right.appendChild(b);
    });
    syncToggles();
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function onHz(btn) {
    if (btn.disabled) return;
    if (selHz === btn) { btn.classList.remove('sel'); selHz = null; return; }
    if (selHz) selHz.classList.remove('sel');
    selHz = btn;
    btn.classList.add('sel');
  }

  function onId(btn, w) {
    if (btn.disabled || !selHz) return;
    var hzBtn = selHz;
    if (hzBtn.dataset.k === btn.dataset.k) {
      hzBtn.classList.remove('sel'); hzBtn.classList.add('ok'); hzBtn.disabled = true;
      btn.classList.add('ok'); btn.disabled = true;
      selHz = null; correct++;
      updateScore();
      if (document.querySelectorAll('#ck-left .ck-card.ok').length === PAIRS) {
        setTimeout(nextRound, 700);
      }
    } else {
      hzBtn.classList.add('bad'); btn.classList.add('bad');
      mistakes++; updateScore();
      selHz = null;
      setTimeout(function() {
        hzBtn.classList.remove('bad','sel'); btn.classList.remove('bad');
      }, 450);
    }
  }

  function nextRound() {
    round++;
    if (round >= ROUNDS || (round + 1) * PAIRS > session.length) { finish(); return; }
    showRound();
  }

  function updateScore() {
    $('ck-score').textContent = S.score.replace('{c}', correct).replace('{m}', mistakes);
  }

  function finish() {
    $('ck-area').style.display = 'none';
    var d = $('ck-done');
    d.style.display = '';
    $('ck-result').innerHTML = '<p class="ck-done-big">' + S.doneTitle + '</p><p>' +
      S.doneStats.replace('{c}', correct).replace('{m}', mistakes) + '</p>';
    $('ck-start').style.display = '';
    $('ck-start').textContent = S.again;
  }

  function syncToggles() {
    $('ck-pinyin').classList.toggle('on', pinyinOn);
    $('ck-pinyin').textContent = S.pinyin + ' ' + (pinyinOn ? 'ON' : 'OFF');
    $('ck-zen').classList.toggle('on', zen);
    document.querySelector('.ck-board').classList.toggle('hide-py', !pinyinOn);
    document.querySelector('.ck-top').classList.toggle('zen', zen);
  }

  $('ck-pinyin').addEventListener('click', function() { pinyinOn = !pinyinOn; syncToggles(); });
  $('ck-zen').addEventListener('click', function() { zen = !zen; syncToggles(); });
  $('ck-start').addEventListener('click', startGame);
  $('ck-again').addEventListener('click', startGame);
  syncToggles();

  fetch('/vocab-data.json').then(function(r) { return r.json(); }).then(function(j) { DATA = j; });
})
</script>


<style>
.ck-controls { display: flex; gap: 8px; margin: 12px 0; flex-wrap: wrap; align-items: center; }
.ck-controls button { padding: 10px 18px; border-radius: 10px; font-weight: 700; cursor: pointer; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); }
#ck-start { background: #C8102E; color: #fff; border: none; }
.ck-toggle.on { background: #C8102E; border-color: #C8102E; color: #fff; }
.ck-top { display: flex; justify-content: space-between; color: var(--vp-c-text-2); margin: 8px 0; font-weight: 600; }
.ck-top.zen #ck-score { visibility: hidden; }
.ck-board { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 640px; }
.ck-col { display: flex; flex-direction: column; gap: 10px; }
.ck-card { border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); border-radius: 14px; padding: 14px 10px; cursor: pointer; text-align: center; min-height: 76px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; transition: transform .12s, border-color .12s, background .12s; font-size: 1.05rem; color: var(--vp-c-text-1); }
.ck-card:hover:not(:disabled) { transform: translateY(-2px); border-color: #C8102E; }
.ck-card .ck-big { font-size: 1.7rem; font-weight: 800; line-height: 1.2; }
.ck-card .ck-py { font-size: .8rem; color: var(--vp-c-text-2); }
.ck-board.hide-py .ck-py { display: none; }
.ck-card.sel { border-color: #C8102E; border-width: 2px; background: #fff1f2; }
.dark .ck-card.sel { background: #3a0d14; }
.ck-card.ok { border-color: #2e7d32; background: #e8f5e9; color: #2e7d32; opacity: .55; }
.dark .ck-card.ok { background: #0f2e15; }
.ck-card.bad { border-color: #C8102E; background: #fde8ea; animation: ckshake .3s; }
.dark .ck-card.bad { background: #3a0d14; }
.ck-card:disabled { cursor: default; }
@keyframes ckshake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
.ck-done { text-align: center; padding: 24px; max-width: 480px; }
.ck-done-big { font-size: 1.8rem; margin-bottom: 8px; }
#ck-again { padding: 12px 28px; background: #C8102E; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; margin-top: 12px; }
</style>
