import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from '../types';

interface CartState {
  items: OrderItem[];
  customerId?: string;
  customerName?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  
  // Actions
  addItem: (product: { id: string; name: string; price: number }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setCustomer: (id?: string, name?: string) => void;
  setDiscount: (amount: number) => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,

  // Add item to cart
  addItem: (product) => {
    const { items } = get();
    const existingItem = items.find(item => item.productId === product.id);

    if (existingItem) {
      // Update quantity if product already exists in cart
      get().updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      // Add new item if it doesn't exist
      const newItem: OrderItem = {
        id: uuidv4(),
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price,
      };

      set(state => ({
        items: [...state.items, newItem]
      }));
      get().calculateTotals();
    }
  },

  // Update item quantity
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set(state => ({
      items: state.items.map(item => 
        item.id === itemId 
          ? { ...item, quantity, subtotal: item.price * quantity } 
          : item
      )
    }));
    get().calculateTotals();
  },

  // Remove item from cart
  removeItem: (itemId) => {
    set(state => ({
      items: state.items.filter(item => item.id !== itemId)
    }));
    get().calculateTotals();
  },

  // Clear cart
  clearCart: () => {
    set({
      items: [],
      customerId: undefined,
      customerName: undefined,
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    });
  },

  // Set customer info
  setCustomer: (id, name) => {
    set({ customerId: id, customerName: name });
  },

  // Set discount amount
  setDiscount: (amount) => {
    set({ discount: amount });
    get().calculateTotals();
  },

  // Calculate totals
  calculateTotals: () => {
    const { items, discount } = get();
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const taxRate = 0.0825; // 8.25% tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + tax - discount;

    set({
      subtotal,
      tax,
      total: total < 0 ? 0 : total,
    });
  },
}));