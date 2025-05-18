import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  
  getters: {
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price || 0), 0);
    },
    
    itemCount: (state) => {
      return state.items.length;
    }
  },
  
  actions: {
    addItem(item) {
      // Check if item already exists in cart
      const existingItem = this.items.find(i => i.id === item.id);
      if (!existingItem) {
        this.items.push(item);
      }
    },
    
    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId);
    },
    
    clearCart() {
      this.items = [];
    }
  },
  
  // Enable persistence to localStorage
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'oil-service-cart',
        storage: process.client ? localStorage : null
      }
    ]
  }
});
