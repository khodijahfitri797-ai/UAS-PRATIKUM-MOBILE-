// Akun demo yang otomatis di-seed ke AsyncStorage saat pertama kali app dibuka
// (lihat AuthContext), supaya bisa langsung login tanpa perlu daftar manual dulu —
// DummyJSON tidak mengenal username ini karena bukan akun bawaan mereka.
export const DemoAccount = {
  name: 'Fitri Khodijah',
  username: 'fitrikhodijah',
  password: 'fitri123',
  email: 'fitrikhodijah@kampusmarket.test',
} as const;
