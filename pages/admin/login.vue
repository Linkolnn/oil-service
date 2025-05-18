<template>
  <div class="admin-login-page">
    <div class="container">
      <div class="login-container">
        <h1>Админ-панель OIL Сервис</h1>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from '~/components/LoginForm.vue';
</script>

<style lang="scss" scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  
  .container {
    width: 100%;
    max-width: 500px;
    padding: 0 1rem;
  }
  
  .login-container {
    background: #fff;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    
    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
      font-size: 1.8rem;
    }
  }
}
</style>
