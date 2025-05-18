<template>
  <div class="register-form">
    <h2>Регистрация</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="username">Логин</label>
        <input 
          type="text" 
          id="username" 
          v-model="form.username" 
          required 
          placeholder="Придумайте логин"
        />
      </div>
      
      <div class="form-group">
        <label for="name">Имя</label>
        <input 
          type="text" 
          id="name" 
          v-model="form.name" 
          required 
          placeholder="Ваше имя"
        />
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email" 
          required 
          placeholder="Ваш email"
        />
      </div>
      
      <div class="form-group">
        <label for="phone">Телефон</label>
        <input 
          type="tel" 
          id="phone" 
          v-model="form.phone" 
          required 
          placeholder="+7 (___) ___-__-__"
        />
      </div>
      
      <div class="form-group">
        <label for="password">Пароль</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password" 
          required 
          placeholder="Придумайте пароль"
        />
      </div>
      
      <div class="form-group">
        <label for="confirmPassword">Подтверждение пароля</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="form.confirmPassword" 
          required 
          placeholder="Повторите пароль"
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
        {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
      
      <div class="login-link">
        Уже есть аккаунт? <NuxtLink to="/login">Войти</NuxtLink>
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
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

const error = ref('');
const isLoading = ref(false);

const register = async () => {
  error.value = '';
  
  // Validate form
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Пароли не совпадают';
    return;
  }
  
  if (form.value.password.length < 6) {
    error.value = 'Пароль должен содержать не менее 6 символов';
    return;
  }
  
  if (!form.value.phone.startsWith('+7')) {
    error.value = 'Телефон должен начинаться с +7';
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Register user
    const success = await authStore.register({
      username: form.value.username,
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password
    });
    
    if (success) {
      // Redirect to profile page
      router.push('/profile');
    } else {
      error.value = authStore.registrationError || 'Ошибка при регистрации';
    }
  } catch (err) {
    console.error('Registration error:', err);
    error.value = 'Произошла ошибка при регистрации';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.register-form {
  max-width: 500px;
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
  
  .login-link {
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
