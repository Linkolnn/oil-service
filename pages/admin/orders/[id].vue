<template>
  <div class="admin-order-page">
    <div class="admin-header">
      <h1>Детали заказа</h1>
      <button class="back-btn" @click="goBack">Назад к списку</button>
    </div>
    
    <div class="admin-content">
      <OrderDetails />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import OrderDetails from '~/components/admin/OrderDetails.vue';

const router = useRouter();

const goBack = () => {
  router.push('/admin');
};

// Define middleware
definePageMeta({
  middleware: ['auth']
});
</script>

<style lang="scss" scoped>
.admin-order-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h1 {
      margin: 0;
      color: #333;
    }
    
    .back-btn {
      background: #f1f1f1;
      color: #333;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      
      &:hover {
        background: #e0e0e0;
      }
    }
  }
  
  .admin-content {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
