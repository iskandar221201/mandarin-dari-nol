import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ router }: any) {
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

    // ---- Latihan Menulis Hanzi (HanziWriter) ----
    const HW_LIB_URL = 'https://cdn.jsdelivr.net/npm/hanzi-writer@3.7.3/dist/hanzi-writer.min.js'
    const hwDataUrl = (ch: string) => `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(ch)}.json`
    let hwLibPromise: Promise<any> | null = null
    const loadHwLib = (): Promise<any> => {
      if (hwLibPromise) return hwLibPromise
      hwLibPromise = new Promise((resolve, reject) => {
        const w = window as any
        if (w.HanziWriter) return resolve(w.HanziWriter)
        const s = document.createElement('script')
        s.src = HW_LIB_URL
        s.onload = () => resolve(w.HanziWriter)
        s.onerror = () => reject(new Error('gagal memuat HanziWriter'))
        document.head.appendChild(s)
      })
      return hwLibPromise
    }
    const hwIsEN = () => document.documentElement.lang.startsWith('en')
    const hwStr = {
      title: () => (hwIsEN() ? 'Writing Practice' : 'Latihan Menulis'),
      fab: () => (hwIsEN() ? 'Practice' : 'Latihan'),
      hint: () => (hwIsEN() ? 'Pick a character from this page:' : 'Pilih hanzi dari halaman ini:'),
      tabAnim: () => (hwIsEN() ? 'Animation' : 'Animasi'),
      tabQuiz: () => (hwIsEN() ? 'Practice' : 'Latihan'),
      replay: () => (hwIsEN() ? 'Replay animation' : 'Ulangi animasi'),
      requiz: () => (hwIsEN() ? 'Start over' : 'Ulangi latihan'),
      quizHint: () => (hwIsEN() ? 'Trace the faint outline, one stroke at a time.' : 'Ikuti garis tipisnya, tulis per goresan.'),
      animHint: () => (hwIsEN() ? 'Watch the correct stroke order:' : 'Perhatikan urutan goresan yang benar:'),
      done: (n: number) => (hwIsEN() ? `Done! Mistakes: ${n}.` : `Selesai! Kesalahan: ${n}.`),
      back: () => (hwIsEN() ? 'Back to list' : 'Kembali ke daftar'),
      loading: () => (hwIsEN() ? 'Loading...' : 'Memuat...'),
      loadFail: () => (hwIsEN() ? 'Could not load this character. Try another.' : 'Gagal memuat karakter ini. Coba yang lain.'),
    }
    const extractHanzi = (): string[] => {
      const doc = document.querySelector('.vp-doc')
      if (!doc) return []
      const text = doc.textContent || ''
      const seen = new Set<string>()
      const out: string[] = []
      for (const m of text.matchAll(/[\u3400-\u4DBF\u4E00-\u9FFF]/g)) {
        if (!seen.has(m[0])) {
          seen.add(m[0])
          out.push(m[0])
        }
        if (out.length >= 200) break
      }
      return out
    }

    // bangun DOM sekali
    const fab = document.createElement('button')
    fab.type = 'button'
    fab.className = 'hw-fab'
    fab.hidden = true
    document.body.appendChild(fab)

    const overlay = document.createElement('div')
    overlay.className = 'hw-overlay'
    overlay.hidden = true
    overlay.innerHTML = `
      <div class="hw-modal" role="dialog" aria-modal="true">
        <div class="hw-head">
          <strong>\u270D\uFE0F <span class="hw-title"></span></strong>
          <button type="button" class="hw-close" aria-label="Tutup">\u2715</button>
        </div>
        <div class="hw-list">
          <p class="hw-hint"></p>
          <div class="hw-grid"></div>
        </div>
        <div class="hw-detail" hidden>
          <div class="hw-tabs">
            <button type="button" class="hw-tab active" data-tab="animate"></button>
            <button type="button" class="hw-tab" data-tab="quiz"></button>
          </div>
          <div class="hw-canvas-wrap"><div id="hw-target"></div></div>
          <p class="hw-status"></p>
          <div class="hw-actions">
            <button type="button" class="hw-primary"></button>
            <button type="button" class="hw-back"></button>
          </div>
        </div>
      </div>`
    document.body.appendChild(overlay)

    const $ = (sel: string) => overlay.querySelector(sel) as HTMLElement
    let hwWriter: any = null
    let hwChar = ''
    let hwMode: 'animate' | 'quiz' = 'animate'

    const refreshTexts = () => {
      fab.innerHTML = `\u270D\uFE0F <span>${hwStr.fab()}</span>`
      $('.hw-title').textContent = hwStr.title()
      $('.hw-hint').textContent = hwStr.hint()
      const tabs = overlay.querySelectorAll('.hw-tab')
      ;(tabs[0] as HTMLElement).textContent = `\u25B6 ${hwStr.tabAnim()}`
      ;(tabs[1] as HTMLElement).textContent = `\u270F ${hwStr.tabQuiz()}`
      $('.hw-back').textContent = `\u2190 ${hwStr.back()}`
      syncPrimary()
    }
    const syncPrimary = () => {
      $('.hw-primary').textContent = hwMode === 'animate' ? `\u{1F501} ${hwStr.replay()}` : `\u270F ${hwStr.requiz()}`
      $('.hw-status').textContent = hwMode === 'animate' ? hwStr.animHint() : hwStr.quizHint()
    }

    const openModal = () => {
      const chars = extractHanzi()
      if (!chars.length) return
      refreshTexts()
      const grid = $('.hw-grid')
      grid.innerHTML = ''
      chars.forEach((ch) => {
        const b = document.createElement('button')
        b.type = 'button'
        b.className = 'hw-char'
        b.textContent = ch
        b.addEventListener('click', () => openChar(ch))
        grid.appendChild(b)
      })
      ;($('.hw-list') as HTMLElement).hidden = false
      ;($('.hw-detail') as HTMLElement).hidden = true
      overlay.hidden = false
      document.body.style.overflow = 'hidden'
    }
    const closeModal = () => {
      overlay.hidden = true
      document.body.style.overflow = ''
      try { hwWriter?.cancelQuiz() } catch {}
      hwWriter = null
    }

    const openChar = async (ch: string) => {
      hwChar = ch
      hwMode = 'animate'
      ;($('.hw-list') as HTMLElement).hidden = true
      ;($('.hw-detail') as HTMLElement).hidden = false
      overlay.querySelectorAll('.hw-tab').forEach((el, i) => el.classList.toggle('active', i === 0))
      syncPrimary()
      const target = $('#hw-target')
      target.innerHTML = ''
      $('.hw-status').textContent = hwStr.loading()
      try {
        const HanziWriter = await loadHwLib()
        const dark = document.documentElement.classList.contains('dark')
        hwWriter = HanziWriter.create(target, ch, {
          width: 240,
          height: 240,
          padding: 12,
          showOutline: true,
          strokeColor: dark ? '#e5e7eb' : '#1f2937',
          outlineColor: dark ? '#64748b' : '#cbd5e1',
          radicalColor: '#C8102E',
          leniency: 1.3,
          showHintAfterMisses: 2,
          charDataLoader: (c: string, onComplete: (d: any) => void) => {
            fetch(hwDataUrl(c))
              .then((r) => { if (!r.ok) throw new Error('404'); return r.json() })
              .then(onComplete)
              .catch(() => { $('.hw-status').textContent = hwStr.loadFail() })
          },
        })
        startMode()
      } catch {
        $('.hw-status').textContent = hwStr.loadFail()
      }
    }

    const startMode = () => {
      if (!hwWriter) return
      syncPrimary()
      try { hwWriter.cancelQuiz() } catch {}
      if (hwMode === 'animate') {
        hwWriter.animateCharacter()
      } else {
        hwWriter.quiz({
          onComplete: (s: any) => {
            $('.hw-status').textContent = hwStr.done(s.totalMistakes)
          },
        })
      }
    }

    fab.addEventListener('click', openModal)
    overlay.querySelector('.hw-close')!.addEventListener('click', closeModal)
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal() })
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) closeModal() })
    overlay.querySelector('.hw-back')!.addEventListener('click', () => {
      try { hwWriter?.cancelQuiz() } catch {}
      hwWriter = null
      ;($('.hw-detail') as HTMLElement).hidden = true
      ;($('.hw-list') as HTMLElement).hidden = false
    })
    overlay.querySelector('.hw-primary')!.addEventListener('click', startMode)
    overlay.querySelectorAll('.hw-tab').forEach((el) => {
      el.addEventListener('click', () => {
        hwMode = (el as HTMLElement).dataset.tab as 'animate' | 'quiz'
        overlay.querySelectorAll('.hw-tab').forEach((x) => x.classList.toggle('active', x === el))
        startMode()
      })
    })

    const updateFab = () => {
      closeModal()
      const chars = extractHanzi()
      fab.hidden = chars.length === 0
      if (chars.length) refreshTexts()
    }
    router.onAfterRouteChanged = () => updateFab()
    // halaman pertama
    setTimeout(updateFab, 300)
  },
}
