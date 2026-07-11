import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { StorageKeys } from '../constants/storageKeys';
import { Product } from '../services/api';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  cartItems: CartItem[];
  wishlistItems: Product[];
  isHydrating: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInCart: (productId: number) => boolean;
  isInWishlist: (productId: number) => boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: PropsWithChildren) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [cartRaw, wishlistRaw] = await Promise.all([
          AsyncStorage.getItem(StorageKeys.cart),
          AsyncStorage.getItem(StorageKeys.wishlist),
        ]);
        if (cartRaw) setCartItems(JSON.parse(cartRaw) as CartItem[]);
        if (wishlistRaw) setWishlistItems(JSON.parse(wishlistRaw) as Product[]);
      } finally {
        setIsHydrating(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isHydrating) return;
    AsyncStorage.setItem(StorageKeys.cart, JSON.stringify(cartItems));
  }, [cartItems, isHydrating]);

  useEffect(() => {
    if (isHydrating) return;
    AsyncStorage.setItem(StorageKeys.wishlist, JSON.stringify(wishlistItems));
  }, [wishlistItems, isHydrating]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const addToWishlist = (product: Product) => {
    setWishlistItems((prev) => (prev.some((item) => item.id === product.id) ? prev : [...prev, product]));
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInCart = (productId: number) => cartItems.some((item) => item.product.id === productId);
  const isInWishlist = (productId: number) => wishlistItems.some((item) => item.id === productId);

  const value = useMemo(
    () => ({
      cartItems,
      wishlistItems,
      isHydrating,
      addToCart,
      removeFromCart,
      addToWishlist,
      removeFromWishlist,
      isInCart,
      isInWishlist,
    }),
    [cartItems, wishlistItems, isHydrating],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
