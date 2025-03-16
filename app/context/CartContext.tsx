/* eslint-disable @typescript-eslint/no-explicit-any */
// app/context/CartContext.tsx
import type { ReactNode } from 'react';
import { createContext, useContext, useReducer, useState, useEffect } from 'react';

import { formatPrice } from '~/lib/utils';
import type { Product, ProductVariant } from '~/types';

// Cart types
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
  payload?: any;
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
  createCheckout: () => Promise<string>;
}

const initialCart: Cart = {
  items: [],
  itemCount: 0,
  subtotal: '0.00',
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item } = action.payload;
      const existingItemIndex = state.items.findIndex((i) => i.variantId === item.variantId);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + item.quantity
        };
      } else {
        // New item
        newItems = [...state.items, item];
      }
      
      return calculateCartTotals({
        ...state,
        items: newItems,
      });
    }
    
    case 'UPDATE_ITEM': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } });
      }
      
      const newItems = state.items.map((item) => 
        item.id === id ? { ...item, quantity } : item
      );
      
      return calculateCartTotals({
        ...state,
        items: newItems,
      });
    }
    
    case 'REMOVE_ITEM': {
      const { id } = action.payload;
      const newItems = state.items.filter((item) => item.id !== id);
      
      return calculateCartTotals({
        ...state,
        items: newItems,
      });
    }
    
    case 'CLEAR_CART': {
      return calculateCartTotals({
        ...state,
        items: [],
      });
    }
    
    default:
      return state;
  }
}

function calculateCartTotals(cart: Cart): Cart {
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotalValue = cart.items.reduce((total, item) => {
    const price = parseFloat(item.price.amount);
    return total + (price * item.quantity);
  }, 0);
  
  return {
    ...cart,
    itemCount,
    subtotal: formatPrice(subtotalValue),
  };
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const [isOpen, setIsOpen] = useState(false);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tierra-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Recalculate totals in case prices have changed
        Object.entries(parsedCart).forEach(([key, value]) => {
          if (key === 'items' && Array.isArray(value) && value.length > 0) {
            dispatch({ type: 'CLEAR_CART' });
            value.forEach((item: CartItem) => {
              dispatch({
                type: 'ADD_ITEM',
                payload: { item }
              });
            });
          }
        });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('tierra-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);
  
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(!isOpen);
  
  const addItem = (product: Product, variant: ProductVariant, quantity: number) => {
  const item: CartItem = {
    id: `${variant.id}-${Date.now()}`, // Ensure unique ID
    productId: product.id,
    variantId: variant.id,
    title: product.title,
    handle: product.handle,
    imageSrc: product.images[0]?.url || '',
    imageAlt: product.images[0]?.altText || product.title,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    quantity,
    variantTitle: variant.title,
  };
  
  dispatch({ type: 'ADD_ITEM', payload: { item } });
  openCart(); // Open cart drawer when item is added
};
  
  const updateItem = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id, quantity } });
  };
  
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const isItemInCart = (variantId: string) => {
    return cart.items.some(item => item.variantId === variantId);
  };
  
  const createCheckout = async (): Promise<string> => {
    // In a real implementation, this would call Shopify's Checkout API
    // to create a checkout with the items in the cart
    
    // For now, return a mock checkout URL
    const mockCheckoutUrl = `https://yourshopify.com/checkout/${Date.now()}`;
    return Promise.resolve(mockCheckoutUrl);
    
    // Example of real implementation:
    // 1. Call to your server endpoint that creates a checkout with Shopify
    // const response = await fetch('/api/create-checkout', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ items: cart.items }),
    // });
    // 2. Get the checkout URL from the response
    // const data = await response.json();
    // return data.checkoutUrl;
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      isItemInCart,
      createCheckout,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}