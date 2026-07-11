import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Fonts, FontSize } from '../constants/typography';
import AppButton from './AppButton';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'default' | 'error';
}

export default function EmptyState({ icon, title, message, actionLabel, onAction, tone = 'default' }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={tone === 'error' ? Colors.error : Colors.black} />
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      {!!actionLabel && !!onAction && (
        <AppButton title={actionLabel} onPress={onAction} style={styles.action} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: FontSize.lg,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  message: {
    fontFamily: Fonts.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  action: {
    marginTop: Spacing.lg,
  },
});
