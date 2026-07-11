import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../../components/AppButton';
import InputField from '../../components/InputField';
import { Colors } from '../../constants/colors';
import { BorderWidth } from '../../constants/spacing';
import { Spacing } from '../../constants/spacing';
import { Fonts, FontSize } from '../../constants/typography';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { login, isSubmitting } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [formError, setFormError] = useState('');

  const handleSubmit = async () => {
    const nextErrors: typeof errors = {};
    if (!username.trim()) nextErrors.username = 'Username tidak boleh kosong';
    if (!password) nextErrors.password = 'Password tidak boleh kosong';
    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await login(username.trim(), password);
      router.replace('/(tabs)');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Login gagal, coba lagi');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.brand}>KAMPUSMARKET</Text>
          <Text style={styles.subtitle}>JUAL BELI BARANG BEKAS MAHASISWA</Text>

          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>KREDENSIAL DEMO</Text>
            <Text style={styles.hintText}>username: emilys</Text>
            <Text style={styles.hintText}>password: emilyspass</Text>
          </View>

          <InputField
            label="Username"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            autoCapitalize="none"
            placeholder="emilys"
          />
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            placeholder="********"
          />

          {!!formError && <Text style={styles.formError}>{formError}</Text>}

          <AppButton title="Masuk" onPress={handleSubmit} loading={isSubmitting} style={styles.submit} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun?</Text>
            <Link href="/(auth)/register" style={styles.link}>
              Daftar di sini
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
    fontSize: FontSize.xxl,
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
  hintBox: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border,
    backgroundColor: Colors.accentSecondary,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  hintTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.xs,
    color: Colors.white,
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  hintText: {
    fontFamily: Fonts.body,
    fontSize: FontSize.sm,
    color: Colors.white,
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
