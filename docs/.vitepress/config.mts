import { defineConfig } from 'vitepress'

const idNav = [
  { text: 'Beranda', link: '/' },
  { text: 'Mulai Belajar', link: '/bab-0-persiapan' },
  { text: 'Kosakata HSK 1', link: '/kosakata-hsk1' },
  { text: 'Roadmap', link: '/roadmap' },
]

const idSidebar = [
  { text: 'Tentang Buku Ini', link: '/tentang' },
  {
    text: 'Bab 0: Persiapan',
    collapsed: true,
    items: [
      { text: 'Ikhtisar', link: '/bab-0-persiapan' },
      { text: 'Pinyin & Nada', link: '/bab-0-pinyin-nada' },
      { text: 'Praktik Mandiri', link: '/bab-0-praktik' },
    ],
  },
  { text: 'Bab 1: Salam & Perkenalan', link: '/bab-1-salam-perkenalan' },
  { text: 'Bab 2: Angka, Waktu & Uang', link: '/bab-2-angka-waktu' },
  {
    text: 'Bab 3: Radikal & Bedah Hanzi',
    collapsed: true,
    items: [
      { text: 'Ikhtisar', link: '/bab-3-radikal-bedah-hanzi' },
      { text: 'Radikal Dasar', link: '/bab-3-radikal-dasar' },
      { text: 'Pola Lanjutan', link: '/bab-3-pola-lanjutan' },
    ],
  },
  {
    text: 'Bab 4: Kosakata Sehari-hari',
    collapsed: true,
    items: [
      { text: 'Ikhtisar', link: '/bab-4-kosakata-sehari-hari' },
      { text: 'Keluarga, Makanan & Tempat', link: '/bab-4-keluarga-makanan-tempat' },
      { text: 'Benda, Kata Kerja & Kata Sifat', link: '/bab-4-benda-kerja-sifat' },
      { text: 'Waktu, Warna & Arah', link: '/bab-4-waktu-warna-arah' },
    ],
  },
  {
    text: 'Bab 5: Tata Bahasa Dasar',
    collapsed: true,
    items: [
      { text: 'Ikhtisar', link: '/bab-5-tata-bahasa-dasar' },
      { text: 'Kalimat Dasar (1–7)', link: '/bab-5-kalimat-dasar' },
      { text: 'Penjelas & Keterangan (8–13)', link: '/bab-5-penjelas-keterangan' },
      { text: 'Keberadaan & Posisi (14–19)', link: '/bab-5-keberadaan-posisi' },
    ],
  },
  {
    text: 'Bab 6: Dialog & Percakapan',
    collapsed: true,
    items: [
      { text: 'Ikhtisar', link: '/bab-6-dialog-percakapan' },
      { text: 'Dialog 1–5', link: '/bab-6-dialog-1-5' },
      { text: 'Dialog 6–10', link: '/bab-6-dialog-6-10' },
    ],
  },
  { text: 'Bank Latihan', link: '/latihan' },
  { text: 'Daftar Kosakata HSK 1', link: '/kosakata-hsk1' },
  { text: 'Roadmap: Setelah HSK 1', link: '/roadmap' },
]

const enNav = [
  { text: 'Home', link: '/en/' },
  { text: 'Start Learning', link: '/en/bab-0-persiapan' },
  { text: 'HSK 1 Vocabulary', link: '/en/kosakata-hsk1' },
  { text: 'Roadmap', link: '/en/roadmap' },
]

const enSidebar = [
  { text: 'About This Book', link: '/en/tentang' },
  {
    text: 'Chapter 0: Preparation',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/en/bab-0-persiapan' },
      { text: 'Pinyin & Tones', link: '/en/bab-0-pinyin-nada' },
      { text: 'Hands-on Practice', link: '/en/bab-0-praktik' },
    ],
  },
  { text: 'Chapter 1: Greetings & Introductions', link: '/en/bab-1-salam-perkenalan' },
  { text: 'Chapter 2: Numbers, Time & Money', link: '/en/bab-2-angka-waktu' },
  {
    text: 'Chapter 3: Radicals & Character Breakdown',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/en/bab-3-radikal-bedah-hanzi' },
      { text: 'Core Radicals', link: '/en/bab-3-radikal-dasar' },
      { text: 'Advanced Patterns', link: '/en/bab-3-pola-lanjutan' },
    ],
  },
  {
    text: 'Chapter 4: Everyday Vocabulary',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/en/bab-4-kosakata-sehari-hari' },
      { text: 'Family, Food & Places', link: '/en/bab-4-keluarga-makanan-tempat' },
      { text: 'Objects, Verbs & Adjectives', link: '/en/bab-4-benda-kerja-sifat' },
      { text: 'Time, Colors & Directions', link: '/en/bab-4-waktu-warna-arah' },
    ],
  },
  {
    text: 'Chapter 5: Basic Grammar',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/en/bab-5-tata-bahasa-dasar' },
      { text: 'Basic Sentences (1–7)', link: '/en/bab-5-kalimat-dasar' },
      { text: 'Modifiers & Adverbials (8–13)', link: '/en/bab-5-penjelas-keterangan' },
      { text: 'Existence & Position (14–19)', link: '/en/bab-5-keberadaan-posisi' },
    ],
  },
  {
    text: 'Chapter 6: Dialogues & Conversation',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/en/bab-6-dialog-percakapan' },
      { text: 'Dialogues 1–5', link: '/en/bab-6-dialog-1-5' },
      { text: 'Dialogues 6–10', link: '/en/bab-6-dialog-6-10' },
    ],
  },
  { text: 'Exercise Bank', link: '/en/latihan' },
  { text: 'HSK 1 Vocabulary List', link: '/en/kosakata-hsk1' },
  { text: 'Roadmap: After HSK 1', link: '/en/roadmap' },
]

export default defineConfig({
  base: '/',

  // NOTE: per-locale themeConfig WAJIB di dalam tiap locale (locales.<key>.themeConfig),
  // bukan di themeConfig.locales, itu tidak dibaca oleh VitePress.
  locales: {
    root: {
      label: 'Indonesia',
      lang: 'id-ID',
      title: 'Mandarin dari Nol',
      description:
        'Kurikulum belajar Bahasa Mandarin dari nol sampai HSK 1, dokumentasi terbuka berbahasa Indonesia.',
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
          message: 'Ditulis sambil belajar, dari nol, untuk yang mulai dari nol.',
          copyright: '© 2026 Asep Iskandar · Lisensi CC BY-SA 4.0',
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'Mandarin from Zero',
      description:
        'A zero-to-HSK 1 Mandarin curriculum, open documentation for English speakers.',
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
          message: 'Written while learning, from zero, for those starting from zero.',
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
