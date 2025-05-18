<template>
  <div class="order-details-page">
    <div class="container">
      <div class="page-header">
        <h1>Детали заказа</h1>
        <NuxtLink to="/profile" class="back-btn">Назад в профиль</NuxtLink>
      </div>
      
      <div v-if="isLoading" class="loading">
        Загрузка данных заказа...
      </div>
      
      <div v-else-if="!order" class="not-found">
        <p>Заказ не найден или у вас нет доступа к нему</p>
        <NuxtLink to="/profile" class="back-to-profile-btn">Вернуться в профиль</NuxtLink>
      </div>
      
      <div v-else class="order-content">
        <div class="order-header">
          <h2>Заказ #{{ order.id }}</h2>
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
        
        <div class="order-section">
          <h3>Информация о заказе</h3>
          <div class="customer-info">
            <div><strong>Имя:</strong> {{ order.customer.name }}</div>
            <div><strong>Телефон:</strong> {{ order.customer.phone }}</div>
            <div v-if="order.customer.email"><strong>Email:</strong> {{ order.customer.email }}</div>
            <div v-if="order.customer.comment">
              <strong>Комментарий:</strong> {{ order.customer.comment }}
            </div>
          </div>
        </div>
        
        <div class="order-section">
          <h3>Услуги</h3>
          <table class="services-table">
            <thead>
              <tr>
                <th>Услуга</th>
                <th>Цена</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in order.items" :key="index">
                <td>{{ item.title }}</td>
                <td>
                  <span v-if="item.price > 0">{{ item.price }} ₽</span>
                  <span v-else class="free-service">БЕСПЛАТНО!</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Итого:</strong></td>
                <td><strong>{{ order.total }} ₽</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div class="order-actions">
          <NuxtLink to="/profile" class="back-btn">Назад к профилю</NuxtLink>
          <NuxtLink to="/services" class="new-order-btn">Сделать новый заказ</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrdersStore } from '~/stores/orders';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const router = useRouter();
const ordersStore = useOrdersStore();
const authStore = useAuthStore();

const isLoading = ref(true);
const order = ref(null);

const orderId = computed(() => route.params.id);

// Define middleware
definePageMeta({
  middleware: ['user']
});

onMounted(async () => {
  try {
    // Fetch order details
    const fetchedOrder = await ordersStore.fetchOrderById(orderId.value);
    order.value = fetchedOrder;
    
    // If order not found or doesn't belong to the user, redirect to profile
    if (!order.value && !authStore.isAdmin) {
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
    }
  } catch (error) {
    console.error('Error fetching order:', error);
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

// Authentication is already handled by the user middleware
</script>

<style lang="scss" scoped>
.order-details-page {
  padding: 2rem 0 4rem;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h1 {
      margin: 0;
      color: #333;
    }
    
    .back-btn {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: #f1f1f1;
      color: #333;
      border-radius: 4px;
      text-decoration: none;
      transition: background 0.3s;
      
      &:hover {
        background: #e0e0e0;
      }
    }
  }
  
  .loading, .not-found {
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
    
    .back-to-profile-btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #e74c3c;
      color: white;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.3s;
      
      &:hover {
        background: darken(#e74c3c, 10%);
      }
    }
  }
  
  .order-content {
    background: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    .order-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
      
      h2 {
        margin: 0;
        color: #333;
      }
      
      .order-date {
        color: #666;
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
    
    .order-section {
      margin-bottom: 2rem;
      
      h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #333;
        font-size: 1.2rem;
      }
      
      .customer-info {
        div {
          margin-bottom: 0.5rem;
        }
      }
      
      .services-table {
        width: 100%;
        border-collapse: collapse;
        
        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        th {
          font-weight: 600;
          color: #333;
          background: #f9f9f9;
        }
        
        .free-service {
          color: #27ae60;
          font-weight: 600;
        }
        
        tfoot {
          font-weight: 600;
          
          td {
            border-top: 2px solid #eee;
          }
        }
      }
    }
    
    .order-actions {
      display: flex;
      justify-content: space-between;
      
      a {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s;
        
        &.back-btn {
          background: #f1f1f1;
          color: #333;
          
          &:hover {
            background: #e0e0e0;
          }
        }
        
        &.new-order-btn {
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
