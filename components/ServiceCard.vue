<template>
  <div class="service-card">
    <div class="service-image">
      <img :src="service.image || '/images/placeholder.png'" :alt="service.title" />
    </div>
    <div class="service-content">
      <h3>{{ service.title }}</h3>
      <p>{{ service.description }}</p>
      <div class="service-footer">
        <div class="service-price" v-if="service.price > 0">
          {{ service.price }} ₽
        </div>
        <div class="service-free" v-else>
          БЕСПЛАТНО!
        </div>
        <button 
          class="add-to-cart-btn" 
          @click="addToCart"
          :disabled="isInCart"
        >
          {{ isInCart ? 'В корзине' : 'Добавить в корзину' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '~/stores/cart';

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();

const isInCart = computed(() => {
  return cartStore.items.some(item => item.id === props.service.id);
});

const addToCart = () => {
  if (!isInCart.value) {
    cartStore.addItem(props.service);
  }
};
</script>

<style lang="scss" scoped>
.service-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  
  .service-image {
    height: 180px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .service-content {
    padding: 1.5rem;
    
    h3 {
      margin-top: 0;
      margin-bottom: 0.75rem;
      color: #333;
    }
    
    p {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .service-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .service-price {
        font-size: 1.25rem;
        font-weight: 600;
        color: #333;
      }
      
      .service-free {
        font-size: 1.25rem;
        font-weight: 600;
        color: #27ae60;
      }
      
      .add-to-cart-btn {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
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
  }
}
</style>
