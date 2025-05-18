<template>
  <div class="services-page">
    <div class="container">
      <h1>Наши услуги</h1>
      <p class="services-intro">Выберите услуги, которые вам необходимы. Услуги с пометкой "БЕСПЛАТНО!" предоставляются бесплатно при условиях, указанных в описании.</p>
      
      <div class="category-filter">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-btn', { active: selectedCategory === category.id }]"
          @click="changeCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
      
      <div class="services-grid">
        <ServiceCard 
          v-for="service in filteredServices" 
          :key="service.id" 
          :service="service" 
        />
      </div>
      
      <div class="cart-summary" v-if="cartStore.itemCount > 0">
        <div class="cart-info">
          <span>В корзине: {{ cartStore.itemCount }} услуг</span>
          <span>Итого: {{ cartStore.totalPrice }} ₽</span>
        </div>
        <NuxtLink to="/cart" class="go-to-cart-btn">Перейти в корзину</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';
import servicesData from '~/data/services.json';

const cartStore = useCartStore();
const services = ref([]);
const categories = ref([]);
const selectedCategory = ref('all');

onMounted(() => {
  // Load services from JSON file
  services.value = servicesData;
  
  // Extract unique categories
  const uniqueCategories = [...new Set(services.value.map(service => service.category))];
  categories.value = [
    { id: 'all', name: 'Все услуги' },
    ...uniqueCategories.map(category => ({
      id: category,
      name: getCategoryName(category)
    }))
  ];
});

// Filter services by category
const filteredServices = computed(() => {
  if (selectedCategory.value === 'all') {
    return services.value;
  }
  return services.value.filter(service => service.category === selectedCategory.value);
});

// Get human-readable category name
function getCategoryName(categoryId) {
  const categoryNames = {
    'oil': 'Замена масла',
    'filters': 'Замена фильтров',
    'maintenance': 'Обслуживание',
    'diagnostics': 'Диагностика',
    'repair': 'Ремонт'
  };
  return categoryNames[categoryId] || categoryId;
}

// Change selected category
function changeCategory(categoryId) {
  selectedCategory.value = categoryId;
}
</script>

<style lang="scss" scoped>
.services-page {
  padding: 2rem 0 4rem;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .services-intro {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 2rem;
    color: #666;
    line-height: 1.6;
  }
  
  .category-filter {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    
    .category-btn {
      padding: 0.5rem 1rem;
      background: #f1f1f1;
      color: #333;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      
      &:hover {
        background: #e0e0e0;
      }
      
      &.active {
        background: #e74c3c;
        color: white;
      }
    }
  }
  
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .cart-summary {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 1rem;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
    
    .cart-info {
      display: flex;
      flex-direction: column;
      
      span {
        &:first-child {
          font-size: 0.9rem;
          color: #666;
        }
        
        &:last-child {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
        }
      }
    }
    
    .go-to-cart-btn {
      background: #e74c3c;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.3s;
      
      &:hover {
        background: darken(#e74c3c, 10%);
      }
    }
  }
}
</style>
