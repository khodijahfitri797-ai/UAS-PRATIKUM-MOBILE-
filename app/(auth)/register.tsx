import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../../components/AppButton';
import InputField from '../../components/InputField';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Fonts, FontSize } from '../../constants/typography';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail, isValidPassword } from '../../utils/validation';

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

export default function RegisterScreen() {
  const { register, isSubmitting } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');

  const handleSubmit = async () => {
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = 'Nama tidak boleh kosong';
    if (!username.trim()) nextErrors.username = 'Username tidak boleh kosong';
    if (!isValidEmail(email)) nextErrors.email = 'Format email tidak valid';
    if (!isValidPassword(password)) nextErrors.password = 'Password minimal 6 karakter';
    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length > 0) return;

    try {
      // DummyJSON tidak menyediakan endpoint create-user publik yang
      // persisten, jadi akun baru disimulasikan dengan menyimpannya ke
      // AsyncStorage (lihat AuthContext.register) setelah validasi lolos.
      await register({ name: name.trim(), username: username.trim(), email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Registrasi gagal, coba lagi');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.brand}>DAFTAR AKUN</Text>
          <Text style={styles.subtitle}>GABUNG KE KAMPUSMARKET</Text>

          <InputField
            label="Nama Lengkap"
            value={name}
            onChangeText={setName}
            error={errors.name}
            placeholder="Fitri Khodijah"
          />
          <InputField
            label="Username"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            autoCapitalize="none"
            placeholder="fitrikhodijah"
          />
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="nama@email.com"
          />
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            placeholder="Minimal 6 karakter"
          />

          {!!formError && <Text style={styles.formError}>{formError}</Text>}

          <AppButton title="Daftar" onPress={handleSubmit} loading={isSubmitting} style={styles.submit} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun?</Text>
            <Link href="/(auth)/login" style={styles.link}>
              Masuk di sini
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  brand: {
    fontFamily: Fonts.heading,
    fontSize: FontSize.xl,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.xs,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    letterSpacing: 1,
  },
  formError: {
    fontFamily: Fonts.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.error,
    marginBottom: Spacing.md,
  },
  submit: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.xs,
  },
  footerText: {
    fontFamily: Fonts.body,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  link: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.sm,
    color: Colors.accentSecondary,
    textDecorationLine: 'underline',
  },
});
