<template>
  <div class="cart-item">
    <div class="cart-item-info">
      <h3>{{ item.title }}</h3>
      <p v-if="item.price > 0" class="cart-item-price">{{ item.price }} ₽</p>
      <p v-else class="cart-item-free">БЕСПЛАТНО!</p>
    </div>
    <button class="remove-btn" @click="removeFromCart">
      <span>Удалить</span>
    </button>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();

const removeFromCart = () => {
  cartStore.removeItem(props.item.id);
};
</script>

<style lang="scss" scoped>
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  
  .cart-item-info {
    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }
    
    .cart-item-price {
      margin: 0;
      font-weight: 600;
      color: #333;
    }
    
    .cart-item-free {
      margin: 0;
      font-weight: 600;
      color: #27ae60;
    }
  }
  
  .remove-btn {
    background: #f1f1f1;
    color: #e74c3c;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
    
    &:hover {
      background: #ffebee;
    }
  }
}
</style>
