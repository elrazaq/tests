import React from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  stepMultiple: number; // Increment step multiple (1, 2, 5, etc.)
  category: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartTotals {
  totalQuantity: number;
  totalPrice: number;
  totalUniqueItems: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface DialogOptions {
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel?: () => void;
}

