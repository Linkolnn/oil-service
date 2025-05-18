<template>
  <div class="order-history">
    <h2>История заказов</h2>
    
    <div v-if="isLoading" class="loading">
      Загрузка истории заказов...
    </div>
    
    <div v-else-if="orders.length === 0" class="no-orders">
      <p>У вас пока нет заказов</p>
      <NuxtLink to="/services" class="browse-services-btn">Выбрать услуги</NuxtLink>
    </div>
    
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-number">Заказ #{{ order.id }}</div>
          <div class="order-date">{{ formatDate(order.date) }}</div>
          <div class="order-status">
            <span 
              class="status-badge" 
              :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>
        </div>
        
        <div class="order-items">
          <div v-for="(item, index) in order.items" :key="index" class="order-item">
            <div class="item-name">{{ item.title }}</div>
            <div class="item-price">
              <span v-if="item.price > 0">{{ item.price }} ₽</span>
              <span v-else class="free-service">БЕСПЛАТНО!</span>
            </div>
          </div>
        </div>
        
        <div class="order-footer">
          <div class="order-total">
            <span>Итого:</span>
            <span>{{ order.total }} ₽</span>
          </div>
          
          <NuxtLink :to="`/profile/orders/${order.id}`" class="view-details-btn">
            Подробнее
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useOrdersStore } from '~/stores/orders';

const ordersStore = useOrdersStore();
const orders = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    orders.value = await ordersStore.fetchUserOrders();
  } catch (error) {
    console.error('Error fetching user orders:', error);
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getStatusText = (status) => {
  const statusMap = {
    'new': 'Новый',
    'processing': 'В обработке',
    'completed': 'Выполнен',
    'cancelled': 'Отменен'
  };
  return statusMap[status] || 'Новый';
};

const getStatusClass = (status) => {
  const statusClassMap = {
    'new': 'status-new',
    'processing': 'status-processing',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  };
  return statusClassMap[status] || 'status-new';
};
</script>

<style lang="scss" scoped>
.order-history {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .loading, .no-orders {
    text-align: center;
    padding: 2rem;
    color: #666;
    
    p {
      margin-bottom: 1.5rem;
    }
    
    .browse-services-btn {
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
  
  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    
    .order-card {
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
      
      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f9f9f9;
        border-bottom: 1px solid #eee;
        
        @media (max-width: 768px) {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .order-number {
          font-weight: 600;
          color: #333;
        }
        
        .order-date {
          color: #666;
          font-size: 0.9rem;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
          
          &.status-new {
            background: #e3f2fd;
            color: #1976d2;
          }
          
          &.status-processing {
            background: #fff8e1;
            color: #ff8f00;
          }
          
          &.status-completed {
            background: #e8f5e9;
            color: #388e3c;
          }
          
          &.status-cancelled {
            background: #ffebee;
            color: #d32f2f;
          }
        }
      }
      
      .order-items {
        padding: 1rem;
        
        .order-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f5f5f5;
          
          &:last-child {
            border-bottom: none;
          }
          
          .item-name {
            color: #333;
          }
          
          .item-price {
            font-weight: 500;
            
            .free-service {
              color: #27ae60;
            }
          }
        }
      }
      
      .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f9f9f9;
        border-top: 1px solid #eee;
        
        .order-total {
          font-weight: 600;
          
          span:last-child {
            color: #e74c3c;
            margin-left: 0.5rem;
          }
        }
        
        .view-details-btn {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #e74c3c;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: background 0.3s;
          
          &:hover {
            background: darken(#e74c3c, 10%);
          }
        }
      }
    }
  }
}
</style>
