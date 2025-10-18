import { api } from '@/lib/axios';

interface Tree {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  scientificName: string;
  growthTime: string;
  height: string;
  benefits: string[];
  stock: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  tree: Tree;
}

interface CartResponse {
  data: {
    cart: {
      items: CartItem[];
    };
  };
}

// Generate a unique cart token
const generateCartToken = () => {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get cart token from localStorage or create a new one
const getCartToken = (): string => {
  let token = localStorage.getItem('cart_token');
  if (!token) {
    token = generateCartToken();
    localStorage.setItem('cart_token', token);
  }
  return token;
};

export const cartService = {
  async getCartItems(): Promise<CartItem[]> {
    try {
      const token = getCartToken();
      const response = await api.get<CartResponse>(`/api/cart/${token}`);
      return response.data.data.cart.items;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  },

  async addToCart(treeId: string, quantity: number = 1): Promise<void> {
    const token = getCartToken();
    await api.post(`/api/cart/${token}/items`, { treeId, quantity });
  },

  async updateCartItem(itemId: string, quantity: number): Promise<void> {
    const token = getCartToken();
    await api.patch(`/api/cart/${token}/items/${itemId}`, { quantity });
  },

  async removeFromCart(itemId: string): Promise<void> {
    const token = getCartToken();
    await api.delete(`/api/cart/${token}/items/${itemId}`);
  },

  async clearCart(): Promise<void> {
    const token = getCartToken();
    await api.delete(`/api/cart/${token}`);
  }
}; 