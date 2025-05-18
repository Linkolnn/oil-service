import { defineStore } from 'pinia';
import accountsData from '~/data/accounts.json';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    token: null,
    user: null,
    accounts: [],
    registrationError: null
  }),
  
  getters: {
    isAdmin: (state) => {
      return state.isAuthenticated && state.user?.role === 'admin';
    },
    isUser: (state) => {
      return state.isAuthenticated && state.user?.role === 'user';
    }
  },
  
  actions: {
    async initializeAccounts() {
      // Load accounts from JSON file
      this.accounts = accountsData;
    },
    
    async login(username, password) {
      // Initialize accounts if not already loaded
      if (this.accounts.length === 0) {
        await this.initializeAccounts();
      }
      
      // Find user with matching credentials
      const user = this.accounts.find(account => 
        account.username === username && account.password === password
      );
      
      if (user) {
        this.isAuthenticated = true;
        this.token = 'auth-token-' + Date.now();
        
        // Create a copy of the user without the password
        const { password, ...userWithoutPassword } = user;
        this.user = userWithoutPassword;
        
        return true;
      }
      
      return false;
    },
    
    async register(userData) {
      // Initialize accounts if not already loaded
      if (this.accounts.length === 0) {
        await this.initializeAccounts();
      }
      
      this.registrationError = null;
      
      // Check if username or email already exists
      const existingUser = this.accounts.find(account => 
        account.username === userData.username || account.email === userData.email
      );
      
      if (existingUser) {
        if (existingUser.username === userData.username) {
          this.registrationError = 'Пользователь с таким логином уже существует';
        } else {
          this.registrationError = 'Пользователь с такой электронной почтой уже существует';
        }
        return false;
      }
      
      // Create new user
      const newUser = {
        id: this.accounts.length > 0 ? Math.max(...this.accounts.map(a => a.id)) + 1 : 1,
        username: userData.username,
        password: userData.password,
        email: userData.email,
        role: 'user',
        name: userData.name,
        phone: userData.phone,
        registrationDate: new Date().toISOString()
      };
      
      // Add to accounts array
      this.accounts.push(newUser);
      
      // In a real app, we would save this to the backend
      // For demo purposes, we'll just update our local state
      
      // Auto login after registration
      this.isAuthenticated = true;
      this.token = 'auth-token-' + Date.now();
      
      // Create a copy of the user without the password
      const { password, ...userWithoutPassword } = newUser;
      this.user = userWithoutPassword;
      
      return true;
    },
    
    logout() {
      this.isAuthenticated = false;
      this.token = null;
      this.user = null;
    },
    
    checkAuth() {
      // Check if user is already authenticated
      return this.isAuthenticated;
    },
    
    updateUserProfile(profileData) {
      if (!this.isAuthenticated || !this.user) {
        return false;
      }
      
      // Update user in accounts array
      const userIndex = this.accounts.findIndex(account => account.id === this.user.id);
      
      if (userIndex !== -1) {
        // Update fields that are allowed to be updated
        this.accounts[userIndex].name = profileData.name;
        this.accounts[userIndex].phone = profileData.phone;
        
        // If email is being changed, check if it's already in use
        if (profileData.email !== this.user.email) {
          const emailExists = this.accounts.some(account => 
            account.id !== this.user.id && account.email === profileData.email
          );
          
          if (emailExists) {
            return { success: false, error: 'Эта электронная почта уже используется' };
          }
          
          this.accounts[userIndex].email = profileData.email;
        }
        
        // Update current user state
        this.user = { ...this.user, ...profileData };
        
        return { success: true };
      }
      
      return { success: false, error: 'Пользователь не найден' };
    }
  },
  
  // Enable persistence to localStorage
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'oil-service-auth',
        storage: process.client ? localStorage : null
      }
    ]
  }
});
