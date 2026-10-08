# Konverter Pinyin

Ketik pinyin pakai angka nada (`ni3 hao3`, `lv4`), otomatis jadi tanda nada (`nǐ hǎo`, `lǜ`). `v` = `ü`.

<textarea id="py-input" rows="4" placeholder="Ketik di sini: wo3 ai4 ni3"></textarea>
<div><button id="py-go" type="button">Konversi</button>
<button id="py-copy" type="button">Salin hasil</button></div>
<div class="py-output" id="py-output"></div>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  var MARKS = {
    a: ['ā','á','ǎ','à'], e: ['ē','é','ě','è'], i: ['ī','í','ǐ','ì'],
    o: ['ō','ó','ǒ','ò'], u: ['ū','ú','ǔ','ù'], 'v': ['ǖ','ǘ','ǚ','ǜ']
  };

  function convertSyllable(syl) {
    var m = syl.match(/^([a-züv:]+)([1-5])$/i);
    if (!m) return syl;
    var base = m[1].toLowerCase().replace(/u:/g, 'v').replace(/ü/g, 'v');
    var tone = parseInt(m[2], 10);
    if (tone === 5) return base.replace(/v/g, 'ü');
    var lower = base;
    var pos = -1, vowel = '';
    if (/a/.test(lower)) { pos = lower.indexOf('a'); vowel = 'a'; }
    else if (/e/.test(lower)) { pos = lower.indexOf('e'); vowel = 'e'; }
    else if (/ou/.test(lower)) { pos = lower.indexOf('o'); vowel = 'o'; }
    else {
      var vm = lower.match(/[iuv]/g);
      if (vm) { vowel = vm[vm.length - 1]; pos = lower.lastIndexOf(vowel); }
    }
    if (pos < 0) return syl;
    var marked = MARKS[vowel][tone - 1];
    var out = lower.slice(0, pos) + marked + lower.slice(pos + 1);
    out = out.replace(/v/g, 'ü');
    if (/^[A-Z]/.test(syl)) out = out.charAt(0).toUpperCase() + out.slice(1);
    return out;
  }

  function convert(text) {
    return text.split(/(\s+)/).map(function(part) {
      if (/^\s+$/.test(part)) return part;
      return part.split(/([,.?!;:\-—()「」『』"“”‘’]+)/).map(function(tok) {
        return convertSyllable(tok);
      }).join('');
    }).join('');
  }

  function go() {
    var out = convert(document.getElementById('py-input').value);
    document.getElementById('py-output').textContent = out;
  }

  document.getElementById('py-go').addEventListener('click', go);
  document.getElementById('py-input').addEventListener('input', go);
  document.getElementById('py-copy').addEventListener('click', function() {
    var t = document.getElementById('py-output').textContent;
    if (t && navigator.clipboard) navigator.clipboard.writeText(t);
  });
})
</script>

<style>
#py-input { width: 100%; max-width: 640px; padding: 12px; font-size: 1.1rem; border: 2px solid #C8102E; border-radius: 12px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-family: inherit; }
#py-go, #py-copy { margin: 10px 8px 10px 0; padding: 10px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 1rem; }
#py-go { background: #C8102E; color: #fff; border: none; }
#py-copy { background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); }
.py-output { max-width: 640px; min-height: 60px; padding: 16px; font-size: 1.3rem; background: var(--vp-c-bg-soft); border-radius: 12px; border: 1px solid var(--vp-c-divider); margin-top: 8px; white-space: pre-wrap; }
</style>
