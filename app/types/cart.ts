// app/types/cart.ts
import type { ProductVariant, Product } from './product';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  handle: string;
  imageSrc: string;
  imageAlt: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: {
    amount: string;
    currencyCode: string;
  } | null;
  quantity: number;
  variantTitle: string;
}
export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: string;
  checkoutUrl?: string;
}

export interface CartAction {
  type: 'ADD_ITEM' | 'UPDATE_ITEM' | 'REMOVE_ITEM' | 'CLEAR_CART';
  payload?: unknown;
}

export interface CartContextType {
  cart: Cart;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity: number) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isItemInCart: (variantId: string) => boolean;
}