<template>
  <div class="order-details">
    <div v-if="isLoading" class="loading">
      Загрузка данных заказа...
    </div>
    
    <div v-else-if="!order" class="not-found">
      Заказ не найден
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
        <h3>Информация о клиенте</h3>
        <div class="customer-info">
          <div><strong>Имя:</strong> {{ order.customer.name }}</div>
          <div><strong>Телефон:</strong> {{ order.customer.phone }}</div>
          <div v-if="order.customer.comment">
            <strong>Комментарий:</strong> {{ order.customer.comment }}
          </div>
        </div>
      </div>
      
      <div class="order-section">
        <h3>Услуги</h3>
        <div class="table-responsive">
          <table class="services-table">
            <thead>
              <tr>
                <th>Услуга</th>
                <th>Цена</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in order.items" :key="index">
                <td data-label="Услуга">{{ item.title }}</td>
                <td data-label="Цена">
                  <span v-if="item.price > 0">{{ item.price }} ₽</span>
                  <span v-else class="free-service">БЕСПЛАТНО!</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td data-label=""><strong>Итого:</strong></td>
                <td data-label=""><strong>{{ order.total }} ₽</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <div class="order-actions">
        <div class="status-control">
          <label for="status-select">Изменить статус:</label>
          <select 
            id="status-select"
            v-model="currentStatus" 
            @change="updateStatus" 
            class="status-select"
            :class="getStatusSelectClass(currentStatus)"
          >
            <option value="new">Новый</option>
            <option value="processing">В обработке</option>
            <option value="completed">Выполнен</option>
            <option value="cancelled">Отменен</option>
          </select>
        </div>
        <button class="back-btn" @click="goBack">Назад к списку</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrdersStore } from '~/stores/orders';

const route = useRoute();
const router = useRouter();
const ordersStore = useOrdersStore();

const isLoading = ref(true);
const order = ref(null);
const currentStatus = ref('');

const orderId = computed(() => route.params.id);

onMounted(async () => {
  try {
    await ordersStore.fetchOrderById(orderId.value);
    order.value = ordersStore.currentOrder;
    
    if (order.value) {
      currentStatus.value = order.value.status || 'new';
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

const getStatusSelectClass = (status) => {
  const statusSelectClassMap = {
    'new': 'select-new',
    'processing': 'select-processing',
    'completed': 'select-completed',
    'cancelled': 'select-cancelled'
  };
  return statusSelectClassMap[status] || 'select-new';
};

const updateStatus = async () => {
  try {
    await ordersStore.updateOrderStatus(orderId.value, currentStatus.value);
    // Update local order object
    if (order.value) {
      order.value.status = currentStatus.value;
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    alert('Не удалось обновить статус заказа');
  }
};

const goBack = () => {
  router.push('/admin');
};
</script>

<style lang="scss">
.order-details {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  .loading, .not-found {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  
  .order-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
    gap: 1rem;
    
    h2 {
      margin: 0;
      color: #333;
      font-size: clamp(1.2rem, 5vw, 1.5rem);
    }
    
    .order-date {
      color: #666;
      font-size: 0.9rem;
    }
    
    .order-status {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .status-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 500;
        white-space: nowrap;
        
        &.status-new {
          background: #ff9800; // Orange
          color: white;
        }
        
        &.status-processing {
          background: #ffc107; // Yellow
          color: #333;
        }
        
        &.status-completed {
          background: #4caf50; // Green
          color: white;
        }
        
        &.status-cancelled {
          background: #f44336; // Red
          color: white;
        }
      }
    }
  }
  
  .order-section {
    margin-bottom: 2rem;
    
    h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #333;
      font-size: clamp(1rem, 4vw, 1.2rem);
    }
    
    .customer-info {
      div {
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
      }
    }
    
    .table-responsive {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
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
    align-items: flex-start;
    margin-top: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
    
    .status-control {
      width: 100%;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      label {
        font-size: 0.9rem;
        color: #666;
      }
      
      .status-select {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 500;
        color: white;
        cursor: pointer;
        transition: opacity 0.3s;
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }
        
        option {
          background: white;
          color: #333;
        }
        
        &.select-new {
          background: #ff9800; // Orange
          
          &:hover {
            opacity: 0.8;
          }
        }
        
        &.select-processing {
          background: #ffc107; // Yellow
          
          &:hover {
            opacity: 0.8;
          }
        }
        
        &.select-completed {
          background: #4caf50; // Green
          
          &:hover {
            opacity: 0.8;
          }
        }
        
        &.select-cancelled {
          background: #f44336; // Red
          
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
    
    .back-btn {
      padding: 0.5rem 1rem;
      background: rgb(207, 38, 38);
      border: none;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      transition: opacity 0.3s;
      white-space: nowrap;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  @media (max-width: 767px) {
    padding: 1rem;
    
    .order-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      
      .order-date {
        margin-top: 0.25rem;
      }
    }
    
    .order-actions {
      flex-direction: column;
      gap: 1.5rem;
      
      .status-control {
        max-width: 100%;
      }
      
      .back-btn {
        align-self: flex-start;
      }
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    
    .services-table {
      border: 0;
      
      thead {
        border: none;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }
      
      tr {
        display: block;
        margin-bottom: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      
      td {
        display: block;
        font-size: 0.9rem;
        text-align: right;
        position: relative;
        padding-left: 45%;
        
        &:last-child {
          border-bottom: 0;
        }
        
        &::before {
          content: attr(data-label);
          position: absolute;
          left: 0.75rem;
          width: 40%;
          padding-right: 0.5rem;
          white-space: nowrap;
          text-align: left;
          font-weight: 600;
          color: #666;
        }
      }
      
      tfoot tr {
        background: #f9f9f9;
        margin-top: 1rem;
      }
    }
  }
}
</style>
