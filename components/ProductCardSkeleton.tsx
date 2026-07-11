import { StyleSheet, View } from 'react-native';

import { Colors } from '../constants/colors';
import { BorderWidth, Radius, Spacing } from '../constants/spacing';

export default function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.body}>
        <View style={[styles.block, { width: '80%' }]} />
        <View style={[styles.block, { width: '50%', marginTop: Spacing.xs }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: Colors.skeleton,
    borderBottomWidth: BorderWidth.thick,
    borderColor: Colors.border,
  },
  body: {
    padding: Spacing.sm,
  },
  block: {
    height: 12,
    backgroundColor: Colors.skeleton,
    borderRadius: Radius.sm,
  },
});
