export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'main' | 'drink' | 'side' | 'dessert';
  available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  tableNumber: string;
  specialInstructions: string;
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  subtitle: string;
  whatsappNumber: string;
  email: string;
  social: string;
  instagramUrl?: string;
  phone?: string;
  address?: string;
  currency: string;
  coverTitle: string;
  coverSubtitle: string;
  coverTagline: string;
  paymentConfig?: PaymentConfig;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface PaymentConfig {
  bankAccounts: BankAccount[];
  warningMessage: string;
  secondaryWarning: string;
  paymentProofMessage: string;
}

export interface MenuConfig {
  categories: MenuCategory[];
}
