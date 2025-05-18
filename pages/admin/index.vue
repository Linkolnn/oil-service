<template>
  <div class="admin-dashboard">
    <div class="admin-header">
      <h1>Панель управления</h1>
      <button class="logout-btn" @click="logout">Выйти</button>
    </div>
    
    <div class="admin-tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'orders' }" 
        @click="activeTab = 'orders'"
      >
        Заказы
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'users' }" 
        @click="activeTab = 'users'"
      >
        Пользователи
      </button>
    </div>
    
    <div class="admin-content">
      <OrderList v-if="activeTab === 'orders'" />
      <UserList v-if="activeTab === 'users'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import OrderList from '~/components/admin/OrderList.vue';
import UserList from '~/components/admin/UserList.vue';

const authStore = useAuthStore();
const router = useRouter();
const activeTab = ref('orders');

// Check if user is authenticated
if (!authStore.isAuthenticated) {
  router.push('/admin/login');
}

const logout = () => {
  authStore.logout();
  router.push('/login');
};

// Define middleware
definePageMeta({
  middleware: ['auth']
});
</script>

<style lang="scss" scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
    
    h1 {
      margin: 0;
      color: #333;
      font-size: clamp(1.5rem, 5vw, 2rem);
    }
    
    .logout-btn {
      background: rgb(207, 38, 38);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      white-space: nowrap;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  .admin-tabs {
    display: flex;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    }
    
    .tab-btn {
      padding: 0.75rem 1.5rem;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      font-size: 1rem;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      transition: all 0.3s;
      flex: 1;
      min-width: max-content;
      
      &:hover {
        color: #e76d3c;
      }
      
      &.active {
        color: #e76d3c;
        border-bottom-color: #e76d3c;
      }
    }
  }
  
  .admin-content {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
    
    .admin-header {
      justify-content: center;
      text-align: center;
      
      h1 {
        width: 100%;
        margin-bottom: 0.5rem;
      }
    }
    
    .admin-tabs {
      .tab-btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
    }
  }
}
</style>
