<template>
  <div class="order-success-page">
    <div class="container">
      <div class="success-card">
        <div class="success-icon">
          <span>✓</span>
        </div>
        <h1>Заказ успешно оформлен!</h1>
        <p>Спасибо за ваш заказ. Номер вашего заказа: <strong>{{ orderId }}</strong></p>
        <p>Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
        <div class="buttons">
          <NuxtLink to="/" class="home-btn">На главную</NuxtLink>
          <NuxtLink to="/services" class="services-btn">К услугам</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const orderId = ref('');

onMounted(() => {
  if (process.client) {
    // Get the order ID from localStorage
    orderId.value = localStorage.getItem('lastOrderId') || 'N/A';
    
    // If there's no order ID, redirect to home
    if (orderId.value === 'N/A') {
      router.push('/');
    }
  }
});
</script>

<style lang="scss" scoped>
.order-success-page {
  padding: 4rem 0;
  
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .success-card {
    background: #fff;
    border-radius: 8px;
    padding: 3rem 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    
    .success-icon {
      width: 80px;
      height: 80px;
      background: #27ae60;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
      
      span {
        color: white;
        font-size: 2.5rem;
        font-weight: 700;
      }
    }
    
    h1 {
      color: #333;
      margin-bottom: 1.5rem;
    }
    
    p {
      color: #666;
      margin-bottom: 1rem;
      font-size: 1.1rem;
      line-height: 1.6;
      
      strong {
        color: #e74c3c;
      }
    }
    
    .buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
      
      a {
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s;
        
        &.home-btn {
          background: #f1f1f1;
          color: #333;
          
          &:hover {
            background: #e0e0e0;
          }
        }
        
        &.services-btn {
          background: #e74c3c;
          color: white;
          
          &:hover {
            background: darken(#e74c3c, 10%);
          }
        }
      }
    }
  }
}
</style>
