# KampusMarket

Aplikasi marketplace jual-beli barang bekas mahasiswa. Dibangun untuk UAS Praktikum
Pemrograman Mobile (React Native & Expo) — UIR, menggunakan Expo SDK 54, TypeScript, dan
Expo Router.

Desain mengusung tema **"Brutal Market"** (neo-brutalism): border tebal, hard offset shadow,
warna kontras tinggi (krem, kuning acid, biru elektrik), dan tipografi besar/tegas
(Archivo Black + Space Grotesk).

## Cara Menjalankan

```bash
npm install
npx expo start
```

Scan QR code dengan aplikasi Expo Go (Android/iOS), atau tekan `a` / `i` untuk membuka
emulator/simulator.

## Kredensial Login Demo

- Username: `fitrikhodijah`
- Password: `fitri123`

Akun ini **bukan** akun asli DummyJSON — DummyJSON hanya mengenali akun bawaan mereka
sendiri (mis. `emilys` / `emilyspass`, yang juga tetap bisa dipakai untuk login karena app
mencoba API asli terlebih dahulu). Karena DummyJSON tidak menyediakan endpoint create-user
publik yang persisten, akun `fitrikhodijah` di-seed otomatis ke `AsyncStorage` saat app
pertama kali dibuka (lihat `ensureDemoAccountSeeded` di `contexts/AuthContext.tsx`), persis
seperti akun yang dibuat lewat halaman **Daftar**.

## Sumber Data

Semua request ke [DummyJSON](https://dummyjson.com) ada di `services/api.ts`: daftar
produk, detail produk, kategori, pencarian, produk per kategori, dan login.

## Struktur Folder

```
app/
  (auth)/
    login.tsx          Halaman Login
    register.tsx        Halaman Daftar Akun
    _layout.tsx
  (tabs)/
    _layout.tsx          Bottom tab navigator (Home, Keranjang, Profil)
    index.tsx            Home / Katalog Produk (FlatList, search, filter kategori)
    cart.tsx              Keranjang & Wishlist
    profile.tsx           Profil user + Logout
  product/[id].tsx        Detail Produk
  _layout.tsx              Root layout: font loading + auth guard (Stack.Protected)
components/
  AppButton.tsx           Tombol brutal (primary/secondary/outline) + loading state
  InputField.tsx          Input form dengan label & error inline
  ProductCard.tsx          Kartu produk untuk grid FlatList
  CategoryChip.tsx         Chip filter kategori (pill, border tebal)
  EmptyState.tsx           State kosong/error dengan tombol retry
  BrutalShadow.tsx         Primitif hard-shadow (dipakai komponen di atas)
  ProductCardSkeleton.tsx  Skeleton loading bergaya blok solid
contexts/
  AuthContext.tsx          Login, register (simulasi), logout, sesi via AsyncStorage
  CartContext.tsx           Keranjang & wishlist, persist via AsyncStorage
services/
  api.ts                    Semua fungsi fetch ke DummyJSON
constants/
  colors.ts / typography.ts / spacing.ts / shadows.ts / storageKeys.ts
utils/
  validation.ts             Validasi email & password
```

## Auth Guard

Navigasi dilindungi dengan `<Stack.Protected guard={...}>` di `app/_layout.tsx`: user yang
belum login hanya bisa mengakses grup `(auth)`, dan otomatis diarahkan kembali ke sana jika
mencoba membuka tab manapun tanpa sesi aktif.
