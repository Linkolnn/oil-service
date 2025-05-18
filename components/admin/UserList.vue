<template>
  <div class="user-list">
    <h2>Список пользователей</h2>
    
    <div v-if="isLoading" class="loading">
      Загрузка пользователей...
    </div>
    
    <div v-else-if="users.length === 0" class="no-users">
      Нет зарегистрированных пользователей
    </div>
    
    <div v-else class="table-responsive">
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th class="hide-xs">Логин</th>
            <th class="hide-sm">Телефон</th>
            <th>Email</th>
            <th>Роль</th>
            <th class="hide-md">Дата регистрации</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td data-label="ID">{{ user.id }}</td>
            <td data-label="Имя">{{ user.name }}</td>
            <td data-label="Логин" class="hide-xs">{{ user.username }}</td>
            <td data-label="Телефон" class="hide-sm">{{ user.phone }}</td>
            <td data-label="Email">{{ user.email }}</td>
            <td data-label="Роль">
              <span 
                class="role-badge" 
                :class="user.role === 'admin' ? 'role-admin' : 'role-user'"
              >
                {{ user.role === 'admin' ? 'Администратор' : 'Пользователь' }}
              </span>
            </td>
            <td data-label="Дата регистрации" class="hide-md">{{ formatDate(user.registrationDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const users = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    // Initialize accounts if not already loaded
    if (authStore.accounts.length === 0) {
      await authStore.initializeAccounts();
    }
    
    // Get all users
    users.value = authStore.accounts.map(account => {
      // Create a copy without the password
      const { password, ...userWithoutPassword } = account;
      return userWithoutPassword;
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};
</script>

<style lang="scss" scoped>
.user-list {
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
  
  .loading, .no-users {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .users-table {
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
    
    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
      white-space: nowrap;
      
      &.role-admin {
        background: #1976d2;
        color: white;
      }
      
      &.role-user {
        background: #4caf50;
        color: white;
      }
    }
  }
  
  @media (max-width: 992px) {
    .hide-md {
      display: none;
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
    
    .users-table {
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
