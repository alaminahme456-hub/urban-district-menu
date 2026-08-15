import { create } from 'zustand';
import { OrderItem, CustomerDetails, MenuItem } from '@/lib/types';

interface OrderState {
  items: OrderItem[];
  customerDetails: CustomerDetails;
  isBasketOpen: boolean;
  isCheckoutOpen: boolean;

  // Actions
  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearOrder: () => void;
  setCustomerDetails: (details: Partial<CustomerDetails>) => void;
  setBasketOpen: (open: boolean) => void;
  toggleBasket: () => void;
  setCheckoutOpen: (open: boolean) => void;

  // Computed
  getTotal: () => number;
  getItemCount: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  items: [],
  customerDetails: {
    name: '',
    tableNumber: '',
    specialInstructions: '',
  },
  isBasketOpen: false,
  isCheckoutOpen: false,

  addItem: (menuItem: MenuItem) => {
    const { items } = get();
    const existingItem = items.find((item) => item.menuItem.id === menuItem.id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...items, { menuItem, quantity: 1 }] });
    }
  },

  removeItem: (menuItemId: string) => {
    set({ items: get().items.filter((item) => item.menuItem.id !== menuItemId) });
  },

  updateQuantity: (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      ),
    });
  },

  clearOrder: () => {
    set({ items: [], customerDetails: { name: '', tableNumber: '', specialInstructions: '' } });
  },

  setCustomerDetails: (details: Partial<CustomerDetails>) => {
    set({
      customerDetails: { ...get().customerDetails, ...details },
    });
  },

  setBasketOpen: (open: boolean) => {
    set({ isBasketOpen: open });
  },

  toggleBasket: () => {
    set({ isBasketOpen: !get().isBasketOpen });
  },

  setCheckoutOpen: (open: boolean) => {
    set({ isCheckoutOpen: open });
  },

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
