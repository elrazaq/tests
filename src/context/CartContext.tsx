import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Product, CartItem, CartTotals } from '../types';

interface CartContextType {
  cart: CartItem[];
  totals: CartTotals;
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  changeQuantityByStep: (productId: number, direction: 1 | -1) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback((product: Product, quantity?: number) => {
    const qtyToAdd = quantity ?? (product.stepMultiple || 1);
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + qtyToAdd,
        };
        return next;
      }
      return [...prev, { product, quantity: qtyToAdd }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    setCart((prev) => {
      if (newQuantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) => {
        if (item.product.id !== productId) return item;
        return { ...item, quantity: newQuantity };
      });
    });
  }, []);

  const changeQuantityByStep = useCallback((productId: number, direction: 1 | -1) => {
    setCart((prev) => {
      const target = prev.find((item) => item.product.id === productId);
      if (!target) return prev;

      const step = target.product.stepMultiple || 1;
      const nextQuantity = target.quantity + direction * step;

      if (nextQuantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }

      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: nextQuantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totals: CartTotals = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        acc.totalQuantity += item.quantity;
        acc.totalPrice += item.product.price * item.quantity;
        acc.totalUniqueItems += 1;
        return acc;
      },
      { totalQuantity: 0, totalPrice: 0, totalUniqueItems: 0 }
    );
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        totals,
        isCartOpen,
        toggleCart,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        changeQuantityByStep,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

