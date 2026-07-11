import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryChip from '../../components/CategoryChip';
import EmptyState from '../../components/EmptyState';
import { Colors } from '../../constants/colors';
import { BorderWidth, Radius, Spacing } from '../../constants/spacing';
import { Fonts, FontSize } from '../../constants/typography';
import { CartItem, useCart } from '../../contexts/CartContext';
import { Product } from '../../services/api';

type Tab = 'cart' | 'wishlist';

export default function CartScreen() {
  const { cartItems, wishlistItems, removeFromCart, removeFromWishlist } = useCart();
  const [tab, setTab] = useState<Tab>('cart');

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.brand}>KERANJANG</Text>
      </View>

      <View style={styles.tabRow}>
        <CategoryChip label={`Keranjang (${cartItems.length})`} active={tab === 'cart'} onPress={() => setTab('cart')} />
        <CategoryChip
          label={`Wishlist (${wishlistItems.length})`}
          active={tab === 'wishlist'}
          onPress={() => setTab('wishlist')}
        />
      </View>

      {tab === 'cart' ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.product.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState icon="bag-outline" title="Keranjang Kosong" message="Yuk cari barang bekas yang kamu butuhkan" />
          }
          renderItem={({ item }) => (
            <CartRow item={item} onRemove={() => removeFromCart(item.product.id)} />
          )}
        />
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState icon="heart-outline" title="Wishlist Kosong" message="Simpan barang favoritmu di sini" />
          }
          renderItem={({ item }) => (
            <WishlistRow product={item} onRemove={() => removeFromWishlist(item.id)} />
          )}
        />
      )}

      {tab === 'cart' && cartItems.length > 0 && (
        <View style={styles.totalBar}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function CartRow({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  return (
    <RowContainer
      product={item.product}
      onRemove={onRemove}
      extra={item.quantity > 1 ? `x${item.quantity}` : undefined}
    />
  );
}

function WishlistRow({ product, onRemove }: { product: Product; onRemove: () => void }) {
  return <RowContainer product={product} onRemove={onRemove} />;
}

function RowContainer({
  product,
  onRemove,
  extra,
}: {
  product: Product;
  onRemove: () => void;
  extra?: string;
}) {
  return (
    <Pressable style={styles.row} onPress={() => router.push(`/product/${product.id}`)}>
      <Image source={{ uri: product.thumbnail }} style={styles.rowImage} />
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.rowPrice}>
          ${product.price.toFixed(2)} {extra}
        </Text>
      </View>
      <Pressable onPress={onRemove} hitSlop={12} style={styles.removeButton}>
        <Ionicons name="trash" size={18} color={Colors.error} />
      </Pressable>
    </Pressable>
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
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  rowImage: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
    backgroundColor: Colors.skeleton,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border,
  },
  rowBody: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  rowTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  rowPrice: {
    fontFamily: Fonts.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginTop: 2,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: BorderWidth.thick,
    borderTopColor: Colors.border,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  totalLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSize.md,
    color: Colors.black,
    letterSpacing: 1,
  },
  totalValue: {
    fontFamily: Fonts.heading,
    fontSize: FontSize.lg,
    color: Colors.black,
  },
});
