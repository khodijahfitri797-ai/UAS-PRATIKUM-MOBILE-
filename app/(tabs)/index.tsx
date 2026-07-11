import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryChip from '../../components/CategoryChip';
import EmptyState from '../../components/EmptyState';
import ProductCard from '../../components/ProductCard';
import ProductCardSkeleton from '../../components/ProductCardSkeleton';
import { Colors } from '../../constants/colors';
import { BorderWidth, Radius, Spacing } from '../../constants/spacing';
import { Fonts, FontSize } from '../../constants/typography';
import { Category, fetchCategories, fetchProducts, Product } from '../../services/api';

const SEARCH_DEBOUNCE_MS = 400;
const INITIAL_FETCH_LIMIT = 100;

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  // Debounce search input so filtering doesn't run on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setStatus('loading');
      setErrorMessage('');
      try {
        const [productData, categoryData] = await Promise.all([
          fetchProducts({ limit: INITIAL_FETCH_LIMIT, skip: 0 }, controller.signal),
          fetchCategories(controller.signal),
        ]);
        setProducts(productData.products);
        setCategories(categoryData);
        setStatus('success');
      } catch (error) {
        if (controller.signal.aborted) return;
        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat produk');
        setStatus('error');
      }
    })();

    return () => controller.abort();
  }, [reloadToken]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [productData, categoryData] = await Promise.all([
        fetchProducts({ limit: INITIAL_FETCH_LIMIT, skip: 0 }),
        fetchCategories(),
      ]);
      setProducts(productData.products);
      setCategories(categoryData);
      setStatus('success');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat produk');
    } finally {
      setRefreshing(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedCategory) {
      list = list.filter((product) => product.category === selectedCategory);
    }
    const query = debouncedQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((product) => product.title.toLowerCase().includes(query));
    }
    return list;
  }, [products, selectedCategory, debouncedQuery]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.brand}>KAMPUSMARKET</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={Colors.black} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari barang bekas..."
          placeholderTextColor={Colors.muted}
          value={searchInput}
          onChangeText={setSearchInput}
          autoCapitalize="none"
        />
      </View>

      {status === 'success' && categories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipRow}
          contentContainerStyle={styles.chipRowContent}
        >
          <CategoryChip label="Semua" active={selectedCategory === null} onPress={() => setSelectedCategory(null)} />
          {categories.map((category) => (
            <CategoryChip
              key={category.slug}
              label={category.name}
              active={selectedCategory === category.slug}
              onPress={() => setSelectedCategory(category.slug)}
            />
          ))}
        </ScrollView>
      )}

      {status === 'loading' && (
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, index) => `skeleton-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={() => <ProductCardSkeleton />}
        />
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

      {status === 'success' && (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="file-tray-outline"
              title="Produk Tidak Ditemukan"
              message="Coba kata kunci lain atau ubah filter kategori"
            />
          }
          ListFooterComponent={filteredProducts.length > 0 ? <View style={styles.footerSpacer} /> : null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.black} />
          }
        />
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  brand: {
    fontFamily: Fonts.heading,
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    fontFamily: Fonts.body,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  chipRow: {
    flexGrow: 0,
    height: 44,
    marginBottom: Spacing.md,
  },
  chipRowContent: {
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  columnWrapper: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  footerSpacer: {
    height: Spacing.lg,
  },
});
