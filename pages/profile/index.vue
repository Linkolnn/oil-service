<template>
  <div class="profile-page">
    <div class="container">
      <h1>Личный кабинет</h1>
      
      <div v-if="!authStore.isAuthenticated" class="not-authenticated">
        <p>Для доступа к личному кабинету необходимо авторизоваться</p>
        <div class="auth-buttons">
          <NuxtLink to="/login" class="login-btn">Войти</NuxtLink>
          <NuxtLink to="/register" class="register-btn">Зарегистрироваться</NuxtLink>
        </div>
      </div>
      
      <div v-else class="profile-content">
        <ProfileInfo :user="authStore.user" />
        <OrderHistory />
        
        <div class="logout-container">
          <button @click="logout" class="logout-btn">Выйти из аккаунта</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import { useOrdersStore } from '~/stores/orders';

const router = useRouter();
const authStore = useAuthStore();
const ordersStore = useOrdersStore();

// Initialize auth store
if (authStore.accounts.length === 0) {
  authStore.initializeAccounts();
}

// Fetch user orders
await ordersStore.fetchOrders();

// Define middleware
definePageMeta({
  middleware: ['user']
});

const logout = () => {
  authStore.logout();
  router.push('/');
};

// Authentication is already handled by the user middleware
</script>

<style lang="scss" scoped>
.profile-page {
  padding: 2rem 0 4rem;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  h1 {
    margin-bottom: 2rem;
    color: #333;
    text-align: center;
  }
  
  .not-authenticated {
    text-align: center;
    padding: 3rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    .auth-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      
      a {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s;
        
        &.login-btn {
          background: #e74c3c;
          color: white;
          
          &:hover {
            background: darken(#e74c3c, 10%);
          }
        }
        
        &.register-btn {
          background: #f1f1f1;
          color: #333;
          
          &:hover {
            background: #e0e0e0;
          }
        }
      }
    }
  }
  
  .profile-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    
    .logout-container {
      text-align: center;
      margin-top: 1rem;
      
      .logout-btn {
        background: #f1f1f1;
        color: #333;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          background: #e0e0e0;
        }
      }
    }
  }
}
</style>
