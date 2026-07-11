import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { Colors } from '../constants/colors';
import { BorderWidth, Radius, Spacing } from '../constants/spacing';
import { Fonts, FontSize } from '../constants/typography';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

const InputField = forwardRef<TextInput, Props>(({ label, error, style, ...textInputProps }, ref) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput
        ref={ref}
        style={[styles.input, !!error && styles.inputError, style]}
        placeholderTextColor={Colors.muted}
        {...textInputProps}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

InputField.displayName = 'InputField';

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.sm,
    color: Colors.text,
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    fontFamily: Fonts.body,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    fontFamily: Fonts.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
