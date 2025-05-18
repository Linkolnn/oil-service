import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware if not on admin pages
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
    return;
  }

  const authStore = useAuthStore();
  
  // If user is not authenticated, redirect to login page
  if (!authStore.isAuthenticated) {
    return navigateTo('/admin/login');
  }
});
