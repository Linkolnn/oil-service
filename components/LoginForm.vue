<template>
  <div class="login-form">
    <h2>Вход в личный кабинет</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Логин</label>
        <input 
          type="text" 
          id="username" 
          v-model="form.username" 
          required 
          placeholder="Введите логин"
        />
      </div>
      
      <div class="form-group">
        <label for="password">Пароль</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password" 
          required 
          placeholder="Введите пароль"
        />
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <button 
        type="submit" 
        class="submit-btn" 
        :disabled="isLoading"
      >
        {{ isLoading ? 'Вход...' : 'Войти' }}
      </button>
      
      <div class="register-link">
        Нет аккаунта? <NuxtLink to="/register">Зарегистрироваться</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  username: '',
  password: ''
});

const error = ref('');
const isLoading = ref(false);

const login = async () => {
  error.value = '';
  isLoading.value = true;
  
  try {
    const success = await authStore.login(form.value.username, form.value.password);
    
    if (success) {
      // Redirect based on role
      if (authStore.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
    } else {
      error.value = 'Неверный логин или пароль';
    }
  } catch (err) {
    console.error('Login error:', err);
    error.value = 'Произошла ошибка при входе';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
    text-align: center;
  }
  
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
  
  .submit-btn {
    width: 100%;
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s;
    
    &:hover {
      background: darken(#e74c3c, 10%);
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
  
  .register-link {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #666;
    
    a {
      color: #e74c3c;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
