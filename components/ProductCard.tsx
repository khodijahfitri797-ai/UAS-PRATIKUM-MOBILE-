import { useMemo } from 'react';
import { Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Colors } from '../constants/colors';
import { BrutalOffset } from '../constants/shadows';
import { BorderWidth, Radius, Spacing } from '../constants/spacing';
import { Fonts, FontSize } from '../constants/typography';
import { Product } from '../services/api';
import BrutalShadow from './BrutalShadow';

interface Props {
  product: Product;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function ProductCard({ product, onPress, style }: Props) {
  // Deterministic per-card tilt (1-2deg) for a scrapbook feel, without
  // flickering to a new random value on every re-render.
  const rotation = useMemo(() => {
    const steps = [-2, -1.2, 1, 1.6, -1.6, 2];
    return steps[product.id % steps.length];
  }, [product.id]);

  return (
    <Pressable onPress={onPress} style={[styles.wrapper, style]}>
      {({ pressed }) => (
        <BrutalShadow
          offset={BrutalOffset.sm}
          pressed={pressed}
          radius={Radius.md}
          style={[styles.card, { transform: [{ rotate: `${rotation}deg` }] }]}
        >
          <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>${Math.round(product.price)}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.title} numberOfLines={1}>
              {product.title}
            </Text>
            <Text style={styles.category} numberOfLines={1}>
              {product.category}
            </Text>
          </View>
        </BrutalShadow>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: Colors.skeleton,
  },
  priceBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.accent,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  priceText: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.sm,
    color: Colors.black,
  },
  body: {
    padding: Spacing.sm,
  },
  title: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  category: {
    fontFamily: Fonts.body,
    fontSize: FontSize.xs,
    color: Colors.muted,
    textTransform: 'capitalize',
    marginTop: 2,
  },
});
