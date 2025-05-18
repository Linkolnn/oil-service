import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    currentOrder: null,
    isLoading: false
  }),
  
  getters: {
    // Get orders for the current user
    userOrders: (state) => {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated || !authStore.user) {
        return [];
      }
      
      // If admin, return all orders
      if (authStore.isAdmin) {
        return state.orders;
      }
      
      // For regular users, return only their orders
      return state.orders.filter(order => order.userId === authStore.user.id);
    }
  },
  
  actions: {
    async fetchOrders() {
      this.isLoading = true;
      try {
        // In a real app, this would make an API call to fetch orders
        // For demo purposes, we'll use mock data from localStorage
        if (process.client) {
          const storedOrders = localStorage.getItem('oil-service-orders');
          this.orders = storedOrders ? JSON.parse(storedOrders) : [];
          
          // If no orders exist, create some mock data
          if (this.orders.length === 0) {
            this.createMockOrders();
          }
        } else {
          // On server-side, just return an empty array or mock data
          if (this.orders.length === 0) {
            this.createMockOrders();
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchUserOrders() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated || !authStore.user) {
        return [];
      }
      
      await this.fetchOrders();
      return this.userOrders;
    },
    
    async fetchOrderById(id) {
      this.isLoading = true;
      try {
        // In a real app, this would make an API call to fetch a specific order
        // For demo purposes, we'll use mock data from localStorage
        await this.fetchOrders();
        this.currentOrder = this.orders.find(order => order.id === id) || null;
        
        // Check if user has permission to view this order
        const authStore = useAuthStore();
        if (!authStore.isAdmin && this.currentOrder && this.currentOrder.userId !== authStore.user?.id) {
          this.currentOrder = null;
        }
        
        return this.currentOrder;
      } catch (error) {
        console.error('Error fetching order by ID:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async updateOrderStatus(id, status) {
      try {
        // Check if user is admin
        const authStore = useAuthStore();
        if (!authStore.isAdmin) {
          throw new Error('Только администраторы могут изменять статус заказа');
        }
        
        // In a real app, this would make an API call to update order status
        // For demo purposes, we'll update the local data
        const orderIndex = this.orders.findIndex(order => order.id === id);
        if (orderIndex !== -1) {
          this.orders[orderIndex].status = status;
          
          // Update in localStorage
          if (process.client) {
            localStorage.setItem('oil-service-orders', JSON.stringify(this.orders));
          }
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
    },
    
    createMockOrders() {
      // Create some mock orders for demo purposes
      const mockOrders = [
        {
          id: '1001',
          userId: 2, // Matches user1 from accounts.json
          customer: {
            name: 'Иван Петров',
            phone: '+79001234567',
            email: 'user1@example.com',
            comment: 'Перезвоните мне утром'
          },
          items: [
            { id: 1, title: 'Замена масла в двигателе', price: 0 },
            { id: 2, title: 'Замена масляного фильтра', price: 500 }
          ],
          total: 500,
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed'
        },
        {
          id: '1002',
          userId: 3, // Matches user2 from accounts.json
          customer: {
            name: 'Анна Сидорова',
            phone: '+79009876543',
            email: 'user2@example.com',
            comment: ''
          },
          items: [
            { id: 3, title: 'Диагностика ходовой части', price: 0 },
            { id: 4, title: 'Компьютерная диагностика', price: 1500 }
          ],
          total: 1500,
          date: new Date().toISOString(),
          status: 'new'
        },
        {
          id: '1003',
          userId: 2, // Another order for user1
          customer: {
            name: 'Иван Петров',
            phone: '+79001234567',
            email: 'user1@example.com',
            comment: 'Нужно срочно'
          },
          items: [
            { id: 12, title: 'Компьютерная диагностика', price: 1500 },
            { id: 14, title: 'Видеоэндоскоп', price: 1000 }
          ],
          total: 2500,
          date: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 days ago
          status: 'completed'
        }
      ];
      
      this.orders = mockOrders;
      if (process.client) {
        localStorage.setItem('oil-service-orders', JSON.stringify(mockOrders));
      }
    },
    
    async addOrder(orderData) {
      try {
        const authStore = useAuthStore();
        
        // Add user ID to the order if user is authenticated
        if (authStore.isAuthenticated && authStore.user) {
          orderData.userId = authStore.user.id;
          
          // If user is logged in, use their profile info
          if (!orderData.customer.email && authStore.user.email) {
            orderData.customer.email = authStore.user.email;
          }
        }
        
        await this.fetchOrders();
        
        // Generate a unique order ID
        if (!orderData.id) {
          orderData.id = Date.now().toString();
        }
        
        // Set default status to 'new'
        if (!orderData.status) {
          orderData.status = 'new';
        }
        
        // Add the new order to the list
        this.orders.push(orderData);
        
        // Update in localStorage
        if (process.client) {
          localStorage.setItem('oil-service-orders', JSON.stringify(this.orders));
        }
        
        return orderData.id;
      } catch (error) {
        console.error('Error adding order:', error);
        throw error;
      }
    }
  },
  
  // Enable persistence
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'oil-service-orders-state',
        storage: process.client ? localStorage : null
      }
    ]
  }
});
