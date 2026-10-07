import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'id-ID',
  title: 'Mandarin dari Nol',
  description: 'Kurikulum belajar Bahasa Mandarin dari nol sampai HSK 1 — dokumentasi terbuka berbahasa Indonesia.',
  base: '/mandarin-dari-nol/',

  themeConfig: {
    nav: [
      { text: 'Beranda', link: '/' },
      { text: 'Mulai Belajar', link: '/bab-0-persiapan' },
      { text: 'Kosakata HSK 1', link: '/kosakata-hsk1' },
      { text: 'Roadmap', link: '/roadmap' },
    ],

    sidebar: [
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
    ],

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

    socialLinks: [
      { icon: 'github', link: 'https://github.com/iskandar221201/mandarin-dari-nol' },
    ],

    footer: {
      message: 'Ditulis sambil belajar — dari nol, untuk yang mulai dari nol.',
      copyright: '© 2026 Asep Iskandar · Lisensi CC BY-SA 4.0',
    },
  },
})
