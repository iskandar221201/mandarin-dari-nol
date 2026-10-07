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
  },
}
