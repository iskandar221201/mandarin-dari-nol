import { defineConfig } from 'vitepress'

const idNav = [
  { text: 'Beranda', link: '/' },
  { text: 'Mulai Belajar', link: '/bab-0-persiapan' },
  { text: 'Kosakata HSK 1', link: '/kosakata-hsk1' },
  { text: 'Roadmap', link: '/roadmap' },
]

const idSidebar = [
  {
    text: 'Pengantar',
    items: [
      { text: 'Tentang Buku Ini', link: '/tentang' },
      { text: 'Bab 0: Persiapan', link: '/bab-0-persiapan' },
    ],
  },
  {
    text: 'Fondasi',
    items: [
      { text: 'Bab 1: Salam & Perkenalan', link: '/bab-1-salam-perkenalan' },
      { text: 'Bab 2: Angka, Waktu & Uang', link: '/bab-2-angka-waktu' },
      { text: 'Bab 3: Radikal & Bedah Hanzi', link: '/bab-3-radikal-bedah-hanzi' },
    ],
  },
  {
    text: 'Percakapan',
    items: [
      { text: 'Bab 4: Kosakata Sehari-hari', link: '/bab-4-kosakata-sehari-hari' },
      { text: 'Bab 5: Tata Bahasa Dasar', link: '/bab-5-tata-bahasa-dasar' },
      { text: 'Bab 6: Dialog & Percakapan', link: '/bab-6-dialog-percakapan' },
    ],
  },
  {
    text: 'Latihan & Referensi',
    items: [
      { text: 'Bank Latihan', link: '/latihan' },
      { text: 'Daftar Kosakata HSK 1', link: '/kosakata-hsk1' },
      { text: 'Roadmap: Setelah HSK 1', link: '/roadmap' },
    ],
  },
]

const enNav = [
  { text: 'Home', link: '/en/' },
  { text: 'Start Learning', link: '/en/bab-0-persiapan' },
  { text: 'HSK 1 Vocabulary', link: '/en/kosakata-hsk1' },
  { text: 'Roadmap', link: '/en/roadmap' },
]

const enSidebar = [
  {
    text: 'Introduction',
    items: [
      { text: 'About This Book', link: '/en/tentang' },
      { text: 'Chapter 0: Preparation', link: '/en/bab-0-persiapan' },
    ],
  },
  {
    text: 'Foundations',
    items: [
      { text: 'Chapter 1: Greetings & Introductions', link: '/en/bab-1-salam-perkenalan' },
      { text: 'Chapter 2: Numbers, Time & Money', link: '/en/bab-2-angka-waktu' },
      { text: 'Chapter 3: Radicals & Character Breakdown', link: '/en/bab-3-radikal-bedah-hanzi' },
    ],
  },
  {
    text: 'Conversation',
    items: [
      { text: 'Chapter 4: Everyday Vocabulary', link: '/en/bab-4-kosakata-sehari-hari' },
      { text: 'Chapter 5: Basic Grammar', link: '/en/bab-5-tata-bahasa-dasar' },
      { text: 'Chapter 6: Dialogues & Conversation', link: '/en/bab-6-dialog-percakapan' },
    ],
  },
  {
    text: 'Practice & Reference',
    items: [
      { text: 'Exercise Bank', link: '/en/latihan' },
      { text: 'HSK 1 Vocabulary List', link: '/en/kosakata-hsk1' },
      { text: 'Roadmap: After HSK 1', link: '/en/roadmap' },
    ],
  },
]

export default defineConfig({
  base: '/mandarin-dari-nol/',

  // NOTE: per-locale themeConfig WAJIB di dalam tiap locale (locales.<key>.themeConfig),
  // bukan di themeConfig.locales — itu tidak dibaca oleh VitePress.
  locales: {
    root: {
      label: 'Indonesia',
      lang: 'id-ID',
      title: 'Mandarin dari Nol',
      description:
        'Kurikulum belajar Bahasa Mandarin dari nol sampai HSK 1 — dokumentasi terbuka berbahasa Indonesia.',
      themeConfig: {
        nav: idNav,
        sidebar: idSidebar,
        search: {
          provider: 'local',
          options: {
            locales: {
              root: {
                translations: {
                  button: { buttonText: 'Cari', buttonAriaLabel: 'Cari' },
                  modal: {
                    noResultsText: 'Tidak ada hasil untuk',
                    resetButtonTitle: 'Hapus pencarian',
                    footer: { selectText: 'pilih', navigateText: 'navigasi', closeText: 'tutup' },
                  },
                },
              },
            },
          },
        },
        outline: { label: 'Di halaman ini' },
        docFooter: { prev: '← Sebelumnya', next: 'Berikutnya →' },
        lastUpdated: { text: 'Terakhir diperbarui' },
        returnToTopLabel: 'Kembali ke atas',
        sidebarMenuLabel: 'Daftar isi',
        editLink: {
          pattern: 'https://github.com/iskandar221201/mandarin-dari-nol/edit/main/docs/:path',
          text: 'Ubah halaman ini di GitHub',
        },
        footer: {
          message: 'Ditulis sambil belajar — dari nol, untuk yang mulai dari nol.',
          copyright: '© 2026 Asep Iskandar · Lisensi CC BY-SA 4.0',
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'Mandarin from Zero',
      description:
        'A zero-to-HSK 1 Mandarin curriculum — open documentation for English speakers.',
      link: '/en/',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        search: { provider: 'local' },
        outline: { label: 'On this page' },
        docFooter: { prev: '← Previous', next: 'Next →' },
        lastUpdated: { text: 'Last updated' },
        returnToTopLabel: 'Back to top',
        sidebarMenuLabel: 'Menu',
        editLink: {
          pattern: 'https://github.com/iskandar221201/mandarin-dari-nol/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
        footer: {
          message: 'Written while learning — from zero, for those starting from zero.',
          copyright: '© 2026 Asep Iskandar · CC BY-SA 4.0 license',
        },
      },
    },
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/iskandar221201/mandarin-dari-nol' },
    ],
  },
})
