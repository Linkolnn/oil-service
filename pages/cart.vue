<template>
  <div class="cart-page">
    <div class="container">
      <h1>Корзина</h1>
      
      <div v-if="cartStore.itemCount === 0" class="empty-cart">
        <p>Ваша корзина пуста</p>
        <NuxtLink to="/services" class="back-to-services-btn">Выбрать услуги</NuxtLink>
      </div>
      
      <div v-else class="cart-content">
        <div class="cart-items">
          <h2>Выбранные услуги</h2>
          <CartItem 
            v-for="item in cartStore.items" 
            :key="item.id" 
            :item="item" 
          />
          
          <div class="cart-total">
            <span>Итого:</span>
            <span>{{ cartStore.totalPrice }} ₽</span>
          </div>
          
          <button class="clear-cart-btn" @click="clearCart">Очистить корзину</button>
        </div>
        
        <div class="order-form-container">
          <OrderForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

const clearCart = () => {
  if (confirm('Вы уверены, что хотите очистить корзину?')) {
    cartStore.clearCart();
  }
};
</script>

<style lang="scss" scoped>
.cart-page {
  padding: 2rem 0 4rem;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
  
  .empty-cart {
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
    
    .back-to-services-btn {
      display: inline-block;
      background: #e74c3c;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.3s;
      
      &:hover {
        background: darken(#e74c3c, 10%);
      }
    }
  }
  
  .cart-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    
    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
    
    .cart-items {
      h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #333;
      }
      
      .cart-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 8px;
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
        
        span {
          &:first-child {
            font-weight: 600;
            color: #333;
          }
          
          &:last-child {
            font-size: 1.5rem;
            font-weight: 700;
            color: #e74c3c;
          }
        }
      }
      
      .clear-cart-btn {
        width: 100%;
        padding: 0.75rem;
        background: #f1f1f1;
        color: #666;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s;
        
        &:hover {
          background: #e0e0e0;
          color: #333;
        }
      }
    }
  }
}
</style>
