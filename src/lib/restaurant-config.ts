import { RestaurantConfig, MenuConfig } from './types';

export const restaurantConfig: RestaurantConfig = {
  name: 'URBAN DISTRICT',
  tagline: 'GRILL AND DRINKS',
  subtitle: 'Satisfy your cravings, urban district style',
  whatsappNumber: '2347068215500', // International format: 234 + 07068215500
  email: 'Urban district@gmail.com',
  social: '@Urbandistrictng',
  currency: '₦',
  coverTitle: 'URBAN DISTRICT',
  coverSubtitle: 'GRILL AND DRINKS',
  coverTagline: 'Satisfy your cravings, urban district style',
};

export const menuConfig: MenuConfig = {
  categories: [
    {
      id: 'main-meals',
      name: 'Main Meals',
      items: [
        {
          id: 'asun',
          name: 'ASUN',
          price: 5000,
          description: 'Spicy, grilled and perfectly seasoned.',
          image: '/menu-images/asun.png',
          category: 'main',
          available: true,
        },
        {
          id: 'spaghetti-bbq',
          name: 'SPAGHETTI WITH CHICKEN/TURKEY BBQ',
          price: 6500,
          description: 'Savory spaghetti paired with juicy grilled chicken or turkey.',
          image: '/menu-images/spaghetti.png',
          category: 'main',
          available: true,
        },
        {
          id: 'chicken-chips',
          name: 'CHICKEN/TURKEY WITH CHIPS',
          price: 6500,
          description: 'Grilled to perfection, served with crispy chips.',
          image: '/menu-images/chicken-chips.png',
          category: 'main',
          available: true,
        },
        {
          id: 'dirty-rice-bbq',
          name: 'DIRTY RICE WITH CHICKEN/TURKEY BBQ',
          price: 6500,
          description: 'Flavorful dirty rice served with juicy grilled chicken or turkey.',
          image: '/menu-images/dirty-rice.png',
          category: 'main',
          available: true,
        },
        {
          id: 'bbq-only',
          name: 'CHICKEN/TURKEY BBQ ONLY',
          price: 5000,
          description: 'Juicy, smoky and full of flavor.',
          image: '/menu-images/bbq-platter.png',
          category: 'main',
          available: true,
        },
      ],
    },
    {
      id: 'drinks',
      name: 'Drinks',
      items: [
        {
          id: 'water',
          name: 'WATER',
          price: 1000,
          description: 'Stay refreshed.',
          image: '/menu-images/water.png',
          category: 'drink',
          available: true,
        },
      ],
    },
  ],
};

// Helper to format price
export function formatPrice(amount: number): string {
  return `${restaurantConfig.currency}${amount.toLocaleString()}`;
}

// WhatsApp message generator
export function generateWhatsAppMessage(
  items: { name: string; quantity: number; price: number }[],
  total: number,
  customerDetails?: { name: string; tableNumber: string; specialInstructions: string }
): string {
  let message = `Hello Urban District, I would like to place an order.\n\nOrder:\n`;

  items.forEach((item, index) => {
    message += `${item.quantity}× ${item.name} — ${restaurantConfig.currency}${item.price.toLocaleString()}\n`;
  });

  message += `\nTotal: ${restaurantConfig.currency}${total.toLocaleString()}`;

  if (customerDetails) {
    if (customerDetails.name) {
      message += `\n\nName: ${customerDetails.name}`;
    }
    if (customerDetails.tableNumber) {
      message += `\nTable: ${customerDetails.tableNumber}`;
    }
    if (customerDetails.specialInstructions) {
      message += `\nSpecial Instructions: ${customerDetails.specialInstructions}`;
    }
  }

  return encodeURIComponent(message);
}

// WhatsApp deep link generator
export function getWhatsAppLink(encodedMessage: string): string {
  return `https://wa.me/${restaurantConfig.whatsappNumber}?text=${encodedMessage}`;
}
