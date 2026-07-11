import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { Colors } from '../constants/colors';
import { BrutalOffset } from '../constants/shadows';
import { BorderWidth, Radius, Spacing } from '../constants/spacing';
import { Fonts, FontSize } from '../constants/typography';
import BrutalShadow from './BrutalShadow';

type Variant = 'primary' | 'secondary' | 'outline';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable onPress={isDisabled ? undefined : onPress} disabled={isDisabled}>
      {({ pressed }) => (
        <BrutalShadow
          offset={BrutalOffset.md}
          pressed={pressed && !isDisabled}
          radius={Radius.md}
          style={[
            styles.base,
            variantStyles[variant],
            isDisabled && styles.disabled,
            style,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.black} />
          ) : (
            <Text style={[styles.text, textVariantStyles[variant]]}>{title.toUpperCase()}</Text>
          )}
        </BrutalShadow>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.md,
    letterSpacing: 0.5,
  },
});

const variantStyles: Record<Variant, ViewStyle> = StyleSheet.create({
  primary: {
    backgroundColor: Colors.accent,
  },
  secondary: {
    backgroundColor: Colors.white,
  },
  outline: {
    backgroundColor: Colors.background,
  },
});

const textVariantStyles: Record<Variant, { color: string }> = {
  primary: { color: Colors.black },
  secondary: { color: Colors.black },
  outline: { color: Colors.black },
};
