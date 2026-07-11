import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '../constants/colors';
import { BorderWidth, Radius, Spacing } from '../constants/spacing';
import { Fonts, FontSize } from '../constants/typography';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

export default function CategoryChip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
    >
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    marginRight: Spacing.sm,
  },
  chipActive: {
    backgroundColor: Colors.black,
  },
  chipInactive: {
    backgroundColor: Colors.white,
  },
  label: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.xs,
    textTransform: 'capitalize',
  },
  labelActive: {
    color: Colors.accent,
  },
  labelInactive: {
    color: Colors.black,
  },
});
