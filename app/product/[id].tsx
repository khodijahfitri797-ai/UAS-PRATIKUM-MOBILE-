import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../../components/AppButton';
import BrutalShadow from '../../components/BrutalShadow';
import EmptyState from '../../components/EmptyState';
import { Colors } from '../../constants/colors';
import { BrutalOffset } from '../../constants/shadows';
import { BorderWidth, Radius, Spacing } from '../../constants/spacing';
import { Fonts, FontSize } from '../../constants/typography';
import { useCart } from '../../contexts/CartContext';
import { fetchProductById, Product } from '../../services/api';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);
  const { addToCart, addToWishlist, isInCart, isInWishlist } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setStatus('loading');
      setErrorMessage('');
      try {
        const data = await fetchProductById(productId, controller.signal);
        setProduct(data);
        setStatus('success');
      } catch (error) {
        if (controller.signal.aborted) return;
        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat detail produk');
        setStatus('error');
      }
    })();

    return () => controller.abort();
  }, [productId, reloadToken]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.black} />
        </Pressable>
        <Text style={styles.headerTitle}>DETAIL PRODUK</Text>
        <View style={styles.backButton} />
      </View>

      {status === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.black} />
        </View>
      )}

      {status === 'error' && (
        <EmptyState
          icon="cloud-offline"
          tone="error"
          title="Gagal Memuat Produk"
          message={errorMessage}
          actionLabel="Coba Lagi"
          onAction={() => setReloadToken((token) => token + 1)}
        />
      )}

      {status === 'success' && product && (
        <ScrollView contentContainerStyle={styles.content}>
          <BrutalShadow offset={BrutalOffset.md} radius={Radius.md} style={styles.imageBox}>
            <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>${Math.round(product.price)}</Text>
            </View>
          </BrutalShadow>

          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="star" size={14} color={Colors.black} />
              <Text style={styles.metaText}>{product.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="cube" size={14} color={Colors.black} />
              <Text style={styles.metaText}>Stok {product.stock}</Text>
            </View>
            {!!product.brand && (
              <View style={styles.metaChip}>
                <Ionicons name="pricetag" size={14} color={Colors.black} />
                <Text style={styles.metaText}>{product.brand}</Text>
              </View>
            )}
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.actions}>
            <AppButton
              title={isInWishlist(product.id) ? 'Di Wishlist' : 'Tambah ke Wishlist'}
              variant="secondary"
              onPress={() => addToWishlist(product)}
              disabled={isInWishlist(product.id)}
              style={styles.actionButton}
            />
            <AppButton
              title={isInCart(product.id) ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}
              onPress={() => addToCart(product)}
              disabled={isInCart(product.id)}
              style={styles.actionButton}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: BorderWidth.thick,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.md,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  imageBox: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 260,
    backgroundColor: Colors.skeleton,
  },
  priceBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.accent,
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  priceText: {
    fontFamily: Fonts.heading,
    fontSize: FontSize.lg,
    color: Colors.black,
  },
  category: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.xs,
    color: Colors.accentSecondary,
    textTransform: 'uppercase',
    marginTop: Spacing.lg,
    letterSpacing: 1,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: FontSize.xl,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.white,
  },
  metaText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.text,
    textTransform: 'capitalize',
  },
  description: {
    fontFamily: Fonts.body,
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 22,
    marginTop: Spacing.lg,
  },
  actions: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  actionButton: {
    width: '100%',
  },
});
