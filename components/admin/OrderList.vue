<template>
  <div class="order-list">
    <h2>Список заказов</h2>
    
    <div v-if="isLoading" class="loading">
      Загрузка заказов...
    </div>
    
    <div v-else-if="orders.length === 0" class="no-orders">
      Нет заказов
    </div>
    
    <div v-else class="table-responsive">
      <table class="orders-table">
        <thead>
          <tr>
            <th>№ заказа</th>
            <th>Клиент</th>
            <th class="hide-sm">Телефон</th>
            <th class="hide-xs">Дата</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td data-label="№ заказа">{{ order.id }}</td>
            <td data-label="Клиент">{{ order.customer.name }}</td>
            <td data-label="Телефон" class="hide-sm">{{ order.customer.phone }}</td>
            <td data-label="Дата" class="hide-xs">{{ formatDate(order.date) }}</td>
            <td data-label="Статус">
              <span 
                class="status-badge" 
                :class="getStatusClass(order.status)"
              >
                {{ getStatusText(order.status) }}
              </span>
            </td>
            <td data-label="Действия">
              <NuxtLink :to="`/admin/orders/${order.id}`" class="view-btn">
                Просмотр
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
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
    await ordersStore.fetchOrders();
    orders.value = ordersStore.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
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
.order-list {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
    font-size: clamp(1.2rem, 5vw, 1.5rem);
  }
  
  .loading, .no-orders {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .orders-table {
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
    
    tr:hover {
      background: #f5f5f5;
    }
    
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
    
    .view-btn {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: #e76d3c;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 0.85rem;
      transition: opacity 0.3s;
      white-space: nowrap;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  @media (max-width: 767px) {
    padding: 1rem;
    
    .hide-sm {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    
    .hide-xs {
      display: none;
    }
    
    .orders-table {
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
        margin-bottom: 1.5rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      
      td {
        display: block;
        font-size: 0.9rem;
        text-align: right;
        border-bottom: 1px solid #eee;
        position: relative;
        padding-left: 45%;
        min-height: 1rem;
        
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
    }
  }
}
</style>
