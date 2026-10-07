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
    const bumpScore = (quiz: HTMLElement, ok: boolean) => {
      const el = quiz.querySelector('.quiz-score')
      if (!el) return
      const m = el.textContent?.match(/(\d+)\/(\d+)/)
      if (!m) return
      let [got, total] = [parseInt(m[1]), parseInt(m[2])]
      if (ok) got += 1
      el.textContent = `Skor: ${got}/${total}`
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
        fb(q, ok ? 'good' : 'miss', (ok ? '✅ Benar! ' : '❌ Kurang tepat. ') + (q.dataset.explain || ''))
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
          (ok ? '✅ Benar! ' : `❌ Kurang tepat. Jawaban: <strong>${answers[0]}</strong>. `) +
            (q.dataset.explain || '')
        )
        lock(q, quiz, ok)
        return
      }

      // Susun kata: klik kata berurutan
      const w = t.closest('.quiz-words button') as HTMLElement | null
      if (type === 'order' && w && !w.classList.contains('used')) {
        w.classList.add('used')
        const seq = q.querySelector('.quiz-seq') as HTMLElement | null
        if (seq) seq.textContent = (seq.textContent || '') + (w.dataset.w || '')
        return
      }
      if (type === 'order' && t.closest('.quiz-undo')) {
        const used = Array.from(q.querySelectorAll('.quiz-words button.used'))
        const last = used[used.length - 1] as HTMLElement | undefined
        last?.classList.remove('used')
        const seq = q.querySelector('.quiz-seq') as HTMLElement | null
        if (seq && last) {
          const lw = last.dataset.w || ''
          seq.textContent = (seq.textContent || '').slice(0, -(lw.length))
        }
        return
      }
      if (type === 'order' && t.closest('.quiz-check')) {
        const seq = q.querySelector('.quiz-seq') as HTMLElement | null
        const val = norm(seq?.textContent || '')
        const answers = (q.dataset.answer || '').split('|').map(norm)
        const ok = answers.includes(val)
        fb(
          q,
          ok ? 'good' : 'miss',
          (ok ? '✅ Benar! ' : `❌ Kurang tepat. Jawaban: <strong>${answers[0]}</strong>. `) +
            (q.dataset.explain || '')
        )
        lock(q, quiz, ok)
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
  },
}
