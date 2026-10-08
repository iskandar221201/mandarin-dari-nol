import { defineConfig } from 'vitepress'

const idNav = [
  { text: 'Beranda', link: '/' },
  { text: 'Mulai Belajar', link: '/bab-0-persiapan' },
  {
    text: 'Kosakata',
    items: [
      { text: 'HSK 1', link: '/kosakata-hsk1' },
      { text: 'HSK 2', link: '/kosakata-hsk2' },
      { text: 'HSK 3', link: '/kosakata-hsk3' },
    ],
  },
  {
    text: 'Latihan',
    items: [
      { text: 'Bank Latihan', link: '/latihan' },
      { text: 'Tryout HSK 1', link: '/tryout-hsk1' },
      { text: 'Tryout HSK 2', link: '/bab-10-tryout-hsk2' },
      { text: 'Tryout HSK 3', link: '/bab-14-tryout-hsk3' },
    ],
  },
  { text: 'Silabus', link: '/silabus' },
  { text: 'Roadmap', link: '/roadmap' },
]

const idSidebar = [
  { text: 'Tentang Buku Ini', link: '/tentang' },
  {
    text: 'HSK 1: Dasar',
    collapsed: false,
    items: [
      {
        text: 'Bab 0: Persiapan',
        link: '/bab-0-persiapan',
        collapsed: true,
        items: [
          { text: 'Pinyin & Nada', link: '/bab-0-pinyin-nada' },
          { text: 'Praktik Mandiri', link: '/bab-0-praktik' },
        ],
      },
      { text: 'Bab 1: Salam & Perkenalan', link: '/bab-1-salam-perkenalan' },
      { text: 'Bab 2: Angka, Waktu & Uang', link: '/bab-2-angka-waktu' },
      {
        text: 'Metode Bedah Hanzi',
        link: '/metode-bedah-hanzi',
        collapsed: true,
        items: [
          { text: 'Galeri Pola', link: '/galeri-pola-hanzi' },
          { text: 'Jebakan & Batasan', link: '/jebakan-bedah-hanzi' },
        ],
      },
      {
        text: 'Bab 3: Radikal & Bedah Hanzi',
        link: '/bab-3-radikal-bedah-hanzi',
        collapsed: true,
        items: [
          { text: 'Radikal Dasar', link: '/bab-3-radikal-dasar' },
          { text: 'Pola Lanjutan', link: '/bab-3-pola-lanjutan' },
        ],
      },
      {
        text: 'Bab 4: Kosakata Sehari-hari',
        link: '/bab-4-kosakata-sehari-hari',
        collapsed: true,
        items: [
          { text: 'Keluarga, Makanan & Tempat', link: '/bab-4-keluarga-makanan-tempat' },
          { text: 'Benda, Kata Kerja & Kata Sifat', link: '/bab-4-benda-kerja-sifat' },
          { text: 'Waktu, Warna & Arah', link: '/bab-4-waktu-warna-arah' },
        ],
      },
      {
        text: 'Bab 5: Tata Bahasa Dasar',
        link: '/bab-5-tata-bahasa-dasar',
        collapsed: true,
        items: [
          { text: 'Kalimat Dasar (1–7)', link: '/bab-5-kalimat-dasar' },
          { text: 'Penjelas & Keterangan (8–13)', link: '/bab-5-penjelas-keterangan' },
          { text: 'Keberadaan & Posisi (14–19)', link: '/bab-5-keberadaan-posisi' },
        ],
      },
      {
        text: 'Bab 6: Dialog & Percakapan',
        link: '/bab-6-dialog-percakapan',
        collapsed: true,
        items: [
          { text: 'Dialog 1–5', link: '/bab-6-dialog-1-5' },
          { text: 'Dialog 6–10', link: '/bab-6-dialog-6-10' },
        ],
      },
      { text: 'Daftar Kosakata HSK 1', link: '/kosakata-hsk1' },
      { text: 'Tryout HSK 1', link: '/tryout-hsk1' },
    ],
  },
  {
    text: 'HSK 2: Naik Level',
    collapsed: true,
    items: [
      {
        text: 'Bab 7: Kosakata HSK 2',
        link: '/bab-7-kosakata-hsk2',
        collapsed: true,
        items: [
          { text: 'Orang & Benda', link: '/bab-7-orang-benda' },
          { text: 'Makanan & Sifat', link: '/bab-7-makanan-sifat' },
          { text: 'Kegiatan', link: '/bab-7-kegiatan' },
        ],
      },
      {
        text: 'Bab 8: Tata Bahasa HSK 2',
        link: '/bab-8-tata-bahasa-hsk2',
        collapsed: true,
        items: [
          { text: 'Aspek & Waktu', link: '/bab-8-aspek' },
          { text: 'Perbandingan & Derajat', link: '/bab-8-perbandingan' },
          { text: 'Kalimat Gabungan', link: '/bab-8-gabungan' },
        ],
      },
      {
        text: 'Bab 9: Dialog HSK 2',
        link: '/bab-9-dialog-hsk2',
        collapsed: true,
        items: [
          { text: 'Dialog 1–3', link: '/bab-9-dialog-1-3' },
          { text: 'Dialog 4–6', link: '/bab-9-dialog-4-6' },
        ],
      },
      { text: 'Daftar Kosakata HSK 2', link: '/kosakata-hsk2' },
      { text: 'Tryout HSK 2', link: '/bab-10-tryout-hsk2' },
    ],
  },
  {
    text: 'HSK 3: Makin Serius',
    collapsed: true,
    items: [
      {
        text: 'Bab 11: Kosakata HSK 3',
        link: '/bab-11-kosakata-hsk3',
        collapsed: true,
        items: [
          { text: 'Manusia & Masyarakat', link: '/bab-11-manusia-masyarakat' },
          { text: 'Kegiatan & Kerja', link: '/bab-11-kegiatan-kerja' },
          { text: 'Benda & Tempat', link: '/bab-11-benda-tempat' },
          { text: 'Konsep & Kata Fungsi', link: '/bab-11-konsep-fungsi' },
        ],
      },
      {
        text: 'Bab 12: Tata Bahasa HSK 3',
        link: '/bab-12-tata-bahasa-hsk3',
        collapsed: true,
        items: [
          { text: 'Komplemen', link: '/bab-12-komplemen' },
          { text: 'Ba & Bei', link: '/bab-12-ba-bei' },
          { text: 'Kalimat Majemuk', link: '/bab-12-majemuk' },
          { text: 'Verba & Keterangan', link: '/bab-12-verba-keterangan' },
        ],
      },
      {
        text: 'Bab 13: Dialog HSK 3',
        link: '/bab-13-dialog-hsk3',
        collapsed: true,
        items: [
          { text: 'Dialog 1-3', link: '/bab-13-dialog-1-3' },
          { text: 'Dialog 4-6', link: '/bab-13-dialog-4-6' },
        ],
      },
      { text: 'Daftar Kosakata HSK 3', link: '/kosakata-hsk3' },
      { text: 'Tryout HSK 3', link: '/bab-14-tryout-hsk3' },
    ],
  },
  {
    text: 'Referensi',
    collapsed: true,
    items: [
      { text: 'Bank Latihan', link: '/latihan' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Peta Hanzi', link: '/hanzi-map' },
      {
        text: 'Fitur Interaktif',
        link: '/fitur',
        collapsed: true,
        items: [
          { text: 'Kamus Mini', link: '/fitur/kamus' },
          { text: 'Cek Level HSK', link: '/fitur/cek-hsk' },
          { text: 'Flashcard', link: '/fitur/flashcard' },
          { text: 'Konverter Pinyin', link: '/fitur/pinyin' },
        ],
      },
      { text: 'Fitur', link: '/fitur' },
      { text: 'Peta Hanzi', link: '/hanzi-map' },
    ],
  },
]

const enNav = [
  { text: 'Home', link: '/en/' },
  { text: 'Start Learning', link: '/en/bab-0-persiapan' },
  {
    text: 'Vocabulary',
    items: [
      { text: 'HSK 1', link: '/en/kosakata-hsk1' },
      { text: 'HSK 2', link: '/en/kosakata-hsk2' },
      { text: 'HSK 3', link: '/en/kosakata-hsk3' },
    ],
  },
  {
    text: 'Practice',
    items: [
      { text: 'Exercise Bank', link: '/en/latihan' },
      { text: 'HSK 1 Mock Exam', link: '/en/tryout-hsk1' },
      { text: 'HSK 2 Mock Exam', link: '/en/bab-10-tryout-hsk2' },
      { text: 'HSK 3 Mock Exam', link: '/en/bab-14-tryout-hsk3' },
    ],
  },
  { text: 'Syllabus', link: '/en/silabus' },
  { text: 'Roadmap', link: '/en/roadmap' },
]

const enSidebar = [
  { text: 'About This Book', link: '/en/tentang' },
  {
    text: 'HSK 1: Foundations',
    collapsed: false,
    items: [
      {
        text: 'Chapter 0: Preparation',
        link: '/en/bab-0-persiapan',
        collapsed: true,
        items: [
          { text: 'Pinyin & Tones', link: '/en/bab-0-pinyin-nada' },
          { text: 'Hands-on Practice', link: '/en/bab-0-praktik' },
        ],
      },
      { text: 'Chapter 1: Greetings & Introductions', link: '/en/bab-1-salam-perkenalan' },
      { text: 'Chapter 2: Numbers, Time & Money', link: '/en/bab-2-angka-waktu' },
      {
        text: 'Hanzi Dissection Method',
        link: '/en/metode-bedah-hanzi',
        collapsed: true,
        items: [
          { text: 'Pattern Gallery', link: '/en/galeri-pola-hanzi' },
          { text: 'Traps & Limits', link: '/en/jebakan-bedah-hanzi' },
        ],
      },
      {
        text: 'Chapter 3: Radicals & Character Breakdown',
        link: '/en/bab-3-radikal-bedah-hanzi',
        collapsed: true,
        items: [
          { text: 'Core Radicals', link: '/en/bab-3-radikal-dasar' },
          { text: 'Advanced Patterns', link: '/en/bab-3-pola-lanjutan' },
        ],
      },
      {
        text: 'Chapter 4: Everyday Vocabulary',
        link: '/en/bab-4-kosakata-sehari-hari',
        collapsed: true,
        items: [
          { text: 'Family, Food & Places', link: '/en/bab-4-keluarga-makanan-tempat' },
          { text: 'Objects, Verbs & Adjectives', link: '/en/bab-4-benda-kerja-sifat' },
          { text: 'Time, Colors & Directions', link: '/en/bab-4-waktu-warna-arah' },
        ],
      },
      {
        text: 'Chapter 5: Basic Grammar',
        link: '/en/bab-5-tata-bahasa-dasar',
        collapsed: true,
        items: [
          { text: 'Basic Sentences (1-7)', link: '/en/bab-5-kalimat-dasar' },
          { text: 'Modifiers & Adverbials (8-13)', link: '/en/bab-5-penjelas-keterangan' },
          { text: 'Existence & Position (14-19)', link: '/en/bab-5-keberadaan-posisi' },
        ],
      },
      {
        text: 'Chapter 6: Dialogues & Conversation',
        link: '/en/bab-6-dialog-percakapan',
        collapsed: true,
        items: [
          { text: 'Dialogues 1-5', link: '/en/bab-6-dialog-1-5' },
          { text: 'Dialogues 6-10', link: '/en/bab-6-dialog-6-10' },
        ],
      },
      { text: 'HSK 1 Vocabulary List', link: '/en/kosakata-hsk1' },
      { text: 'HSK 1 Mock Exam', link: '/en/tryout-hsk1' },
    ],
  },
  {
    text: 'HSK 2: Level Up',
    collapsed: true,
    items: [
      {
        text: 'Chapter 7: HSK 2 Vocabulary',
        link: '/en/bab-7-kosakata-hsk2',
        collapsed: true,
        items: [
          { text: 'People & Things', link: '/en/bab-7-orang-benda' },
          { text: 'Food & Adjectives', link: '/en/bab-7-makanan-sifat' },
          { text: 'Activities', link: '/en/bab-7-kegiatan' },
        ],
      },
      {
        text: 'Chapter 8: HSK 2 Grammar',
        link: '/en/bab-8-tata-bahasa-hsk2',
        collapsed: true,
        items: [
          { text: 'Aspect & Time', link: '/en/bab-8-aspek' },
          { text: 'Comparison & Degree', link: '/en/bab-8-perbandingan' },
          { text: 'Combined Sentences', link: '/en/bab-8-gabungan' },
        ],
      },
      {
        text: 'Chapter 9: HSK 2 Dialogues',
        link: '/en/bab-9-dialog-hsk2',
        collapsed: true,
        items: [
          { text: 'Dialogues 1-3', link: '/en/bab-9-dialog-1-3' },
          { text: 'Dialogues 4-6', link: '/en/bab-9-dialog-4-6' },
        ],
      },
      { text: 'HSK 2 Vocabulary List', link: '/en/kosakata-hsk2' },
      { text: 'Chapter 10: HSK 2 Mock Exam', link: '/en/bab-10-tryout-hsk2' },
    ],
  },
  {
    text: 'HSK 3: Getting Serious',
    collapsed: true,
    items: [
      {
        text: 'Chapter 11: HSK 3 Vocabulary',
        link: '/en/bab-11-kosakata-hsk3',
        collapsed: true,
        items: [
          { text: 'People & Society', link: '/en/bab-11-manusia-masyarakat' },
          { text: 'Activities & Work', link: '/en/bab-11-kegiatan-kerja' },
          { text: 'Things & Places', link: '/en/bab-11-benda-tempat' },
          { text: 'Concepts & Function Words', link: '/en/bab-11-konsep-fungsi' },
        ],
      },
      {
        text: 'Chapter 12: HSK 3 Grammar',
        link: '/en/bab-12-tata-bahasa-hsk3',
        collapsed: true,
        items: [
          { text: 'Complements', link: '/en/bab-12-komplemen' },
          { text: 'Ba & Bei', link: '/en/bab-12-ba-bei' },
          { text: 'Compound Sentences', link: '/en/bab-12-majemuk' },
          { text: 'Verbs & Adverbials', link: '/en/bab-12-verba-keterangan' },
        ],
      },
      {
        text: 'Chapter 13: HSK 3 Dialogues',
        link: '/en/bab-13-dialog-hsk3',
        collapsed: true,
        items: [
          { text: 'Dialogues 1-3', link: '/en/bab-13-dialog-1-3' },
          { text: 'Dialogues 4-6', link: '/en/bab-13-dialog-4-6' },
        ],
      },
      { text: 'HSK 3 Vocabulary List', link: '/en/kosakata-hsk3' },
      { text: 'Chapter 14: HSK 3 Mock Exam', link: '/en/bab-14-tryout-hsk3' },
    ],
  },
  {
    text: 'Reference',
    collapsed: true,
    items: [
      { text: 'Exercise Bank', link: '/en/latihan' },
      { text: 'Syllabus', link: '/en/silabus' },
      { text: 'Roadmap', link: '/en/roadmap' },
      { text: 'Hanzi Map', link: '/en/hanzi-map' },
      {
        text: 'Interactive Tools',
        link: '/en/fitur',
        collapsed: true,
        items: [
          { text: 'Mini Dictionary', link: '/en/fitur/kamus' },
          { text: 'HSK Level Checker', link: '/en/fitur/cek-hsk' },
          { text: 'Flashcards', link: '/en/fitur/flashcard' },
          { text: 'Pinyin Converter', link: '/en/fitur/pinyin' },
        ],
      },
      { text: 'Tools', link: '/en/fitur' },
      { text: 'Hanzi Map', link: '/en/hanzi-map' },
    ],
  },
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
