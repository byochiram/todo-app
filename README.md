# Todo App

Aplikasi todo dengan fitur lengkap, dibangun dengan React + Vite. Bisa di-install sebagai PWA di HP dan desktop.

**Live:** https://todo-app-bmg.pages.dev/

## Fitur

- Tambah, edit, hapus todo
- Centang selesai / batalkan
- Prioritas (Tinggi / Sedang / Rendah)
- Kategori (Kerja, Pribadi, Belanja, Belajar, Lainnya)
- Deadline tanggal & jam
- Drag & drop untuk susun ulang
- Filter (Semua / Aktif / Selesai)
- Filter berdasarkan kategori
- Search / cari todo
- Undo hapus
- Export ke JSON
- Simpan ke localStorage
- Responsive (mobile & desktop)
- PWA (install di HP, offline support)

## Tech Stack

- React 19
- Vite 8
- CSS (plain, no framework)
- localStorage
- Service Worker (PWA)

## Struktur Folder

```
src/
├── constants/
│   └── index.js          # Categories, labels, icons, config
├── hooks/
│   ├── useTodos.js       # State + CRUD + localStorage
│   ├── useUndo.js        # Undo stack logic
│   └── useDragDrop.js    # Drag & drop logic
├── components/
│   ├── Icons.jsx          # SVG icon components
│   ├── Stats.jsx          # Stats bar (total, aktif, selesai)
│   ├── EmptyState.jsx     # Empty state
│   ├── TodoForm.jsx       # Form tambah todo
│   ├── TodoItem.jsx       # Item todo
│   ├── Filter.jsx         # Filter tabs
│   └── SearchBar.jsx      # Search input
├── pages/
│   └── TodosPage.jsx      # Halaman utama
├── App.jsx                # Root component
├── main.jsx               # Entry point + register SW
└── index.css              # Styles
```

## Cara Jalankan

```bash
# Clone
git clone https://github.com/byochiram/todo-app.git
cd todo-app

# Install
npm install

# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

## Deploy

App ini di-deploy ke Cloudflare Pages. Setiap push ke `main` akan otomatis deploy.

**Manual deploy:**
```bash
npm run build
npx wrangler pages deploy dist --project-name=todo-app
```

## Install sebagai PWA

**Android:** Buka link → klik ⋮ → Add to Home screen

**iPhone:** Buka link di Safari → klik Share → Add to Home Screen
