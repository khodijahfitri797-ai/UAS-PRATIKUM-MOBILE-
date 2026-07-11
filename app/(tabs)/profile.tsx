import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../../components/AppButton';
import BrutalShadow from '../../components/BrutalShadow';
import { Colors } from '../../constants/colors';
import { BrutalOffset } from '../../constants/shadows';
import { BorderWidth, Radius, Spacing } from '../../constants/spacing';
import { Fonts, FontSize } from '../../constants/typography';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.brand}>PROFIL</Text>
      </View>

      <View style={styles.content}>
        <BrutalShadow offset={BrutalOffset.md} radius={Radius.md} style={styles.card}>
          <Image source={{ uri: user.image }} style={styles.avatar} />
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.username}>@{user.username}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="mail" size={16} color={Colors.black} />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
        </BrutalShadow>

        <AppButton title="Logout" variant="secondary" onPress={handleLogout} style={styles.logoutButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  brand: {
    fontFamily: Fonts.heading,
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  card: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border,
    backgroundColor: Colors.skeleton,
  },
  name: {
    fontFamily: Fonts.heading,
    fontSize: FontSize.lg,
    color: Colors.text,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  username: {
    fontFamily: Fonts.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.accentSecondary,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  infoText: {
    fontFamily: Fonts.body,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  logoutButton: {
    marginTop: Spacing.xl,
  },
});
