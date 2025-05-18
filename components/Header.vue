<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <NuxtLink to="/">
          <h1>OIL Сервис</h1>
        </NuxtLink>
      </div>
      
      <div class="burger-menu" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div class="mobile-menu" :class="{ 'open': isMenuOpen }">
        <div class="mobile-menu-overlay" @click="closeMenu"></div>
        <nav class="mobile-nav">
          <ul>
            <li><NuxtLink to="/" @click="closeMenu">Главная</NuxtLink></li>
            <li><NuxtLink to="/services" @click="closeMenu">Услуги</NuxtLink></li>
            <li><NuxtLink to="/contact" @click="closeMenu">Контакты</NuxtLink></li>
            <li><NuxtLink to="/cart" @click="closeMenu">Корзина</NuxtLink></li>
            <li v-if="isAuthenticated" class="user-menu">
              <NuxtLink to="/profile" class="profile-link" @click="closeMenu">
                <span class="user-icon">◯</span>
                <span class="user-name">{{ userName }}</span>
              </NuxtLink>
            </li>
            <li v-else>
              <NuxtLink to="/login" class="login-link" @click="closeMenu">Войти</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
      
      <nav class="nav">
        <ul>
          <li><NuxtLink to="/">Главная</NuxtLink></li>
          <li><NuxtLink to="/services">Услуги</NuxtLink></li>
          <li><NuxtLink to="/contact">Контакты</NuxtLink></li>
          <li><NuxtLink to="/cart">Корзина</NuxtLink></li>
          <li v-if="isAuthenticated" class="user-menu">
            <NuxtLink to="/profile" class="profile-link">
              <span class="user-icon">◯</span>
              <span class="user-name">{{ userName }}</span>
            </NuxtLink>
          </li>
          <li v-else>
            <NuxtLink to="/login" class="login-link">Войти</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

// State
const isMenuOpen = ref(false);
const authStore = useAuthStore();

// Initialize auth store if needed
if (authStore.accounts.length === 0) {
  authStore.initializeAccounts();
}

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated);
const userName = computed(() => authStore.user?.name || '');

// Methods
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  
  // Prevent scrolling when menu is open
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function closeMenu() {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
}

// Close menu on window resize (if it transitions to desktop size)
function handleResize() {
  if (window.innerWidth >= 768 && isMenuOpen.value) {
    closeMenu();
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  // Make sure to reset body overflow when component is unmounted
  document.body.style.overflow = '';
});
</script>

<style lang="scss" scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    position: relative;
  }
  
  .logo {
    a {
      text-decoration: none;
    }
    
    h1 {
      color: #e76d3c;
      font-size: clamp(1.4rem, 5vw, 1.8rem);
      margin: 0;
      font-weight: 700;
      transition: color 0.3s;
      
      &:hover {
        color: lighten(#e76d3c, 10%);
      }
    }
  }
  
  .burger-menu {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 22px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 110;
    
    @media (max-width: 767px) {
      display: flex;
    }
    
    span {
      display: block;
      width: 100%;
      height: 3px;
      background: #333;
      border-radius: 3px;
      transition: all 0.3s ease;
    }
    
    &.active {
      span {
        &:nth-child(1) {
          transform: translateY(9.5px) rotate(45deg);
          background: #e76d3c;
        }
        
        &:nth-child(2) {
          opacity: 0;
        }
        
        &:nth-child(3) {
          transform: translateY(-9.5px) rotate(-45deg);
          background: #e76d3c;
        }
      }
    }
  }
  
  .mobile-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 320px;
    height: 100vh;
    background: #fff;
    z-index: 100;
    transition: right 0.3s ease;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    padding: 5rem 1.5rem 2rem;
    overflow-y: auto;
    
    &.open {
      right: 0;
    }
    
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease;
    }
    
    &.open .mobile-menu-overlay {
      opacity: 1;
      visibility: visible;
    }
    
    .mobile-nav {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        
        li {
          width: 100%;
          
          a {
            display: block;
            padding: 0.5rem 0;
            font-size: 1.1rem;
            color: #333;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
            
            &:hover, &.router-link-active {
              color: #e76d3c;
            }
          }
          
          &.user-menu {
            .profile-link {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.25rem 0.5rem;
              border-radius: 4px;
              background: #f5f5f5;
              transition: all 0.3s;
              justify-content: flex-start;
              
              &:hover {
                background: #e0e0e0;
              }
              
              .user-icon {
                font-size: 1.2rem;
                color: #e76d3c;
              }
              
              .user-name {
                max-width: 150px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
          
          .login-link {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: #e76d3c;
            color: white !important;
            border-radius: 4px;
            transition: opacity 0.3s;
            
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
  
  .nav {
    display: flex;
    
    @media (max-width: 767px) {
      display: none;
    }
    
    ul {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 1.5rem;
      align-items: center;
      
      li {
        a {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
          
          &:hover, &.router-link-active {
            color: #e76d3c;
          }
        }
        
        &.user-menu {
          .profile-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            background: #f5f5f5;
            transition: all 0.3s;
            
            &:hover {
              background: #e0e0e0;
            }
            
            .user-icon {
              font-size: 1.2rem;
              color: #e76d3c;
            }
            
            .user-name {
              max-width: 100px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              
              @media (min-width: 992px) {
                max-width: 150px;
              }
            }
          }
        }
        
        .login-link {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #e76d3c;
          color: white !important;
          border-radius: 4px;
          transition: opacity 0.3s;
          
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  
  @media (max-width: 480px) {
    .header-content {
      padding: 0.75rem 1rem;
    }
    
    .logo h1 {
      font-size: 1.3rem;
    }
    
    .burger-menu {
      width: 24px;
      height: 18px;
      
      &.active span {
        &:nth-child(1) {
          transform: translateY(7.5px) rotate(45deg);
        }
        
        &:nth-child(3) {
          transform: translateY(-7.5px) rotate(-45deg);
        }
      }
    }
  }
}
</style>
