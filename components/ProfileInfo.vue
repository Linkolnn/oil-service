<template>
  <div class="profile-info">
    <div class="profile-header">
      <h2>Информация профиля</h2>
      <button v-if="!isEditing" @click="startEditing" class="edit-btn">Редактировать</button>
    </div>
    
    <div v-if="isEditing" class="profile-edit-form">
      <form @submit.prevent="saveProfile">
        <div class="form-group">
          <label for="name">Имя</label>
          <input 
            type="text" 
            id="name" 
            v-model="editForm.name" 
            required 
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="editForm.email" 
            required 
          />
        </div>
        
        <div class="form-group">
          <label for="phone">Телефон</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="editForm.phone" 
            required 
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div class="form-actions">
          <button type="submit" class="save-btn" :disabled="isSaving">
            {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
          </button>
          <button type="button" class="cancel-btn" @click="cancelEditing">
            Отмена
          </button>
        </div>
      </form>
    </div>
    
    <div v-else class="profile-details">
      <div class="profile-field">
        <span class="field-label">Логин:</span>
        <span class="field-value">{{ user.username }}</span>
      </div>
      
      <div class="profile-field">
        <span class="field-label">Имя:</span>
        <span class="field-value">{{ user.name }}</span>
      </div>
      
      <div class="profile-field">
        <span class="field-label">Email:</span>
        <span class="field-value">{{ user.email }}</span>
      </div>
      
      <div class="profile-field">
        <span class="field-label">Телефон:</span>
        <span class="field-value">{{ user.phone }}</span>
      </div>
      
      <div class="profile-field">
        <span class="field-label">Дата регистрации:</span>
        <span class="field-value">{{ formatDate(user.registrationDate) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const authStore = useAuthStore();
const isEditing = ref(false);
const isSaving = ref(false);
const error = ref('');

const editForm = ref({
  name: '',
  email: '',
  phone: ''
});

const startEditing = () => {
  editForm.value.name = props.user.name;
  editForm.value.email = props.user.email;
  editForm.value.phone = props.user.phone;
  isEditing.value = true;
  error.value = '';
};

const cancelEditing = () => {
  isEditing.value = false;
  error.value = '';
};

const saveProfile = async () => {
  isSaving.value = true;
  error.value = '';
  
  try {
    const result = await authStore.updateUserProfile({
      name: editForm.value.name,
      email: editForm.value.email,
      phone: editForm.value.phone
    });
    
    if (result.success) {
      isEditing.value = false;
    } else {
      error.value = result.error || 'Не удалось обновить профиль';
    }
  } catch (err) {
    console.error('Error updating profile:', err);
    error.value = 'Произошла ошибка при обновлении профиля';
  } finally {
    isSaving.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};
</script>

<style lang="scss" scoped>
.profile-info {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    h2 {
      margin: 0;
      color: #333;
    }
    
    .edit-btn {
      background: #f1f1f1;
      color: #333;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      
      &:hover {
        background: #e0e0e0;
      }
    }
  }
  
  .profile-details {
    .profile-field {
      margin-bottom: 1rem;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .field-label {
        font-weight: 600;
        color: #666;
        margin-right: 0.5rem;
      }
      
      .field-value {
        color: #333;
      }
    }
  }
  
  .profile-edit-form {
    .form-group {
      margin-bottom: 1.5rem;
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #333;
      }
      
      input {
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
    
    .error-message {
      color: #e74c3c;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      
      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .save-btn {
        background: #e74c3c;
        color: white;
        
        &:hover {
          background: darken(#e74c3c, 10%);
        }
        
        &:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      }
      
      .cancel-btn {
        background: #f1f1f1;
        color: #333;
        
        &:hover {
          background: #e0e0e0;
        }
      }
    }
  }
}
</style>
