import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof window === 'undefined') return
    let current: HTMLAudioElement | null = null
    const stopAll = () => {
      if (current) {
        current.pause()
        current = null
      }
      document.querySelectorAll('.audio-btn.playing').forEach((b) => b.classList.remove('playing'))
    }
    document.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.audio-btn') as HTMLElement | null
      if (!btn) return
      const src = btn.dataset.audio
      if (!src) return
      const abs = new URL(src, document.baseURI).href
      if (current && current.src === abs && !current.paused) {
        stopAll()
        return
      }
      stopAll()
      const audio = new Audio(abs)
      current = audio
      btn.classList.add('playing')
      audio.onended = () => {
        btn.classList.remove('playing')
        if (current === audio) current = null
      }
      audio.onerror = () => {
        btn.classList.remove('playing')
        if (current === audio) current = null
      }
      audio.play().catch(() => {
        btn.classList.remove('playing')
        if (current === audio) current = null
      })
    })

    // ---- Kuis interaktif ----
    const norm = (s: string) => s.trim().replace(/[。？！?!.\s]+$/g, '')
    const isEN = () => document.documentElement.lang.startsWith('en')
    const T = {
      ok: () => (isEN() ? '✅ Correct! ' : '✅ Benar! '),
      bad: () => (isEN() ? '❌ Not quite. ' : '❌ Kurang tepat. '),
      badAns: (a: string) => (isEN() ? `❌ Not quite. Answer: <strong>${a}</strong>. ` : `❌ Kurang tepat. Jawaban: <strong>${a}</strong>. `),
      ret: () => (isEN() ? 'Click to return' : 'Klik untuk mengembalikan'),
    }
    const bumpScore = (quiz: HTMLElement, ok: boolean) => {
      const el = quiz.querySelector('.quiz-score')
      if (!el) return
      const m = el.textContent?.match(/^(.*?)(\d+)\/(\d+)\s*$/)
      if (!m) return
      const label = m[1]
      let [got, total] = [parseInt(m[2]), parseInt(m[3])]
      if (ok) got += 1
      el.textContent = `${label}${got}/${total}`
    }
    const lock = (q: HTMLElement, quiz: HTMLElement, ok: boolean) => {
      q.classList.add('done')
      q.querySelectorAll('button').forEach((b) => ((b as HTMLButtonElement).disabled = true))
      const inp = q.querySelector('.quiz-input') as HTMLInputElement | null
      if (inp) inp.disabled = true
      if (q.dataset.scored === '1') bumpScore(quiz, ok)
    }
    const fb = (q: HTMLElement, cls: string, html: string) => {
      const f = q.querySelector('.quiz-fb') as HTMLElement | null
      if (!f) return
      f.hidden = false
      f.className = 'quiz-fb ' + cls
      f.innerHTML = html
    }
    document.addEventListener('click', (e) => {
      const t = e.target as HTMLElement
      const q = t.closest('.quiz-q') as HTMLElement | null
      if (!q || q.classList.contains('done')) return
      const quiz = t.closest('.quiz') as HTMLElement | null
      if (!quiz) return
      const type = q.dataset.type

      // Pilihan ganda: klik opsi
      const opt = t.closest('.quiz-opts button') as HTMLElement | null
      if (type === 'mc' && opt) {
        const ok = opt.dataset.opt === q.dataset.answer
        opt.classList.add(ok ? 'ok' : 'bad')
        if (!ok) {
          const right = q.querySelector(`.quiz-opts button[data-opt="${q.dataset.answer}"]`)
          right?.classList.add('ok')
        }
        fb(q, ok ? 'good' : 'miss', (ok ? T.ok() : T.bad()) + (q.dataset.explain || ''))
        lock(q, quiz, ok)
        return
      }

      // Isian: tombol cek
      if (type === 'fill' && t.closest('.quiz-check')) {
        const inp = q.querySelector('.quiz-input') as HTMLInputElement | null
        const val = norm(inp?.value || '')
        const answers = (q.dataset.answer || '').split('|').map(norm)
        const ok = answers.includes(val)
        fb(
          q,
          ok ? 'good' : 'miss',
          (ok ? T.ok() : T.badAns(answers[0])) +
            (q.dataset.explain || '')
        )
        lock(q, quiz, ok)
        return
      }

      // Susun kata: klik / drag-and-drop
      const placeWord = (qq: HTMLElement, word: string) => {
        const bank = qq.querySelector(`.quiz-words button[data-w="${word}"]:not(.used)`) as HTMLElement | null
        if (!bank) return
        bank.classList.add('used')
        const drop = qq.querySelector('.quiz-drop') as HTMLElement | null
        if (!drop) return
        const ph = drop.querySelector('.quiz-ph')
        ph?.remove()
        const b = document.createElement('button')
        b.type = 'button'
        b.className = 'quiz-placed'
        b.dataset.w = word
        b.textContent = word
        b.title = T.ret()
        drop.appendChild(b)
      }
      const unplaceWord = (placed: HTMLElement) => {
        const qq = placed.closest('.quiz-q') as HTMLElement | null
        if (!qq) return
        const bank = qq.querySelector(`.quiz-words button[data-w="${placed.dataset.w}"].used`) as HTMLElement | null
        bank?.classList.remove('used')
        const drop = placed.parentElement as HTMLElement | null
        placed.remove()
        if (drop && !drop.querySelector('.quiz-placed')) {
          const ph = document.createElement('span')
          ph.className = 'quiz-ph'
          ph.textContent = drop.dataset.ph || 'Taruh jawaban di sini'
          drop.appendChild(ph)
        }
      }
      const w = t.closest('.quiz-words button') as HTMLElement | null
      if (type === 'order' && w && !w.classList.contains('used')) {
        placeWord(q, w.dataset.w || '')
        return
      }
      const placed = t.closest('.quiz-placed') as HTMLElement | null
      if (type === 'order' && placed) {
        unplaceWord(placed)
        return
      }
      if (type === 'order' && t.closest('.quiz-check')) {
        const words = Array.from(q.querySelectorAll('.quiz-placed')).map((b) => (b as HTMLElement).dataset.w || '')
        const val = norm(words.join(''))
        const answers = (q.dataset.answer || '').split('|').map(norm)
        const ok = answers.includes(val)
        fb(
          q,
          ok ? 'good' : 'miss',
          (ok ? T.ok() : T.badAns(answers[0])) +
            (q.dataset.explain || '')
        )
        lock(q, quiz, ok)
        return
      }

      // Chip hanzi → isi ke input
      const chip = t.closest('.quiz-chips button') as HTMLElement | null
      if (type === 'fill' && chip) {
        const inp = q.querySelector('.quiz-input') as HTMLInputElement | null
        if (inp && !inp.disabled) {
          inp.value = chip.dataset.chip || ''
          inp.focus()
        }
        return
      }

      // Terjemahan/esai: lihat jawaban
      if (type === 'reveal' && t.closest('.quiz-show')) {
        fb(q, 'info', q.dataset.explain || '')
        q.classList.add('done')
        ;(t.closest('.quiz-show') as HTMLButtonElement).disabled = true
        return
      }
    })

    // ---- Drag-and-drop untuk susun kata ----
    document.addEventListener('dragstart', (e) => {
      const chip = (e.target as HTMLElement).closest?.('.quiz-words button') as HTMLElement | null
      if (!chip || chip.classList.contains('used')) return
      e.dataTransfer?.setData('text/plain', chip.dataset.w || '')
      chip.classList.add('dragging')
    })
    document.addEventListener('dragend', () => {
      document.querySelectorAll('.quiz-words button.dragging').forEach((b) => b.classList.remove('dragging'))
      document.querySelectorAll('.quiz-drop.over').forEach((d) => d.classList.remove('over'))
    })
    document.addEventListener('dragover', (e) => {
      const drop = (e.target as HTMLElement).closest?.('.quiz-drop') as HTMLElement | null
      if (!drop || drop.closest('.quiz-q.done')) return
      e.preventDefault()
      drop.classList.add('over')
    })
    document.addEventListener('drop', (e) => {
      const drop = (e.target as HTMLElement).closest?.('.quiz-drop') as HTMLElement | null
      if (!drop) return
      const qq = drop.closest('.quiz-q') as HTMLElement | null
      if (!qq || qq.classList.contains('done')) return
      e.preventDefault()
      drop.classList.remove('over')
      const word = e.dataTransfer?.getData('text/plain') || ''
      if (!word) return
      const bank = qq.querySelector(`.quiz-words button[data-w="${word}"]:not(.used)`) as HTMLElement | null
      if (!bank) return
      bank.classList.add('used')
      const ph = drop.querySelector('.quiz-ph')
      ph?.remove()
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'quiz-placed'
      b.dataset.w = word
      b.textContent = word
      b.title = T.ret()
      drop.appendChild(b)
    })
  },
}
