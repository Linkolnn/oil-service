<template>
  <div class="register-page">
    <div class="container">
      <RegisterForm />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  // If user is already logged in, redirect to profile
  if (authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/profile');
    }
  }
});
</script>

<style lang="scss" scoped>
.register-page {
  padding: 2rem 0 4rem;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
}
</style>
