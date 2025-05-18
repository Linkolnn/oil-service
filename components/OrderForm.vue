<template>
  <div class="order-form">
    <h2>Оформление заказа</h2>
    
    <div v-if="!authStore.isAuthenticated" class="auth-notice">
      <p>Для более удобного оформления заказа рекомендуем авторизоваться или зарегистрироваться.</p>
      <div class="auth-buttons">
        <NuxtLink to="/login" class="login-btn">Войти</NuxtLink>
        <NuxtLink to="/register" class="register-btn">Зарегистрироваться</NuxtLink>
      </div>
    </div>
    
    <form @submit.prevent="submitOrder">
      <div class="form-group">
        <label for="name">Имя</label>
        <input 
          type="text" 
          id="name" 
          v-model="form.name" 
          required 
          placeholder="Введите ваше имя"
        />
      </div>
      
      <div class="form-group">
        <label for="phone">Телефон</label>
        <input 
          type="tel" 
          id="phone" 
          v-model="form.phone" 
          required 
          placeholder="+7 (___) ___-__-__"
        />
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email" 
          placeholder="Введите ваш email (необязательно)"
        />
      </div>
      
      <div class="form-group">
        <label for="comment">Комментарий</label>
        <textarea 
          id="comment" 
          v-model="form.comment" 
          rows="4" 
          placeholder="Дополнительная информация (необязательно)"
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        class="submit-btn" 
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Отправка...' : 'Оформить заказ' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useOrdersStore } from '~/stores/orders';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const cartStore = useCartStore();
const ordersStore = useOrdersStore();
const authStore = useAuthStore();

const form = ref({
  name: '',
  phone: '',
  email: '',
  comment: ''
});

const isSubmitting = ref(false);

// Pre-fill form with user data if authenticated
onMounted(() => {
  if (authStore.isAuthenticated && authStore.user) {
    form.value.name = authStore.user.name || '';
    form.value.phone = authStore.user.phone || '';
    form.value.email = authStore.user.email || '';
  }
});

const submitOrder = async () => {
  if (cartStore.items.length === 0) {
    alert('Пожалуйста, добавьте услуги в корзину перед оформлением заказа');
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Create order data
    const orderData = {
      customer: {
        name: form.value.name,
        phone: form.value.phone,
        email: form.value.email,
        comment: form.value.comment
      },
      items: cartStore.items,
      total: cartStore.totalPrice,
      date: new Date().toISOString(),
      status: 'new'
    };
    
    // Add order to store
    const orderId = await ordersStore.addOrder(orderData);
    
    // Store order ID for the success page
    if (process.client) {
      localStorage.setItem('lastOrderId', orderId);
    }
    
    // Clear cart
    cartStore.clearCart();
    
    // Redirect to success page
    router.push('/order-success');
  } catch (error) {
    console.error('Error submitting order:', error);
    alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.order-form {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
    text-align: center;
  }
  
  .auth-notice {
    background: #f8f9fa;
    border-radius: 6px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border-left: 4px solid #e74c3c;
    
    p {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #666;
    }
    
    .auth-buttons {
      display: flex;
      gap: 1rem;
      
      a {
        display: inline-block;
        padding: 0.5rem 1rem;
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
  
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }
    
    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: #e74c3c;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
      }
    }
  }
  
  .submit-btn {
    width: 100%;
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s;
    
    &:hover {
      background: darken(#e74c3c, 10%);
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>
