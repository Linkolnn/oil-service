# Документация проекта OIL Сервис

Данная документация содержит подробное описание компонентов, страниц и функциональности веб-приложения OIL Сервис, разработанного на Nuxt 3, Vue.js, Pinia и Sass.

## Содержание

1. [Описание проекта](#описание-проекта)
2. [Структура проекта](#структура-проекта)
3. [Компоненты](#компоненты)
   - [Header](#компонент-header)
   - [Footer](#компонент-footer)
   - [ServiceCard](#компонент-servicecard)
   - [YandexMap](#компонент-yandexmap)
   - [LoginForm](#компонент-loginform)
   - [RegisterForm](#компонент-registerform)
   - [OrderForm](#компонент-orderform)
   - [CartItem](#компонент-cartitem)
4. [Страницы](#страницы)
5. [Хранилища (Stores)](#хранилища-stores)
6. [Установка и запуск](#установка-и-запуск)

## Описание проекта

OIL Сервис - это веб-приложение для автосервиса, предоставляющего услуги по замене масла, диагностике и ремонту автомобилей. Приложение позволяет клиентам ознакомиться с услугами, добавить их в корзину и оформить заказ. Также реализована система авторизации пользователей и админ-панель для управления заказами.

Основные функции:
- Просмотр доступных услуг
- Добавление услуг в корзину
- Оформление заказа
- Регистрация и авторизация пользователей
- Просмотр истории заказов в личном кабинете
- Админ-панель для управления заказами

## Структура проекта

Проект имеет следующую структуру:

- **assets/** - статические ресурсы (стили, изображения)
- **components/** - компоненты Vue
- **data/** - данные приложения (услуги, пользователи)
- **middleware/** - промежуточное ПО Nuxt
- **pages/** - страницы приложения
- **public/** - публичные файлы
- **server/** - серверная часть
- **stores/** - хранилища Pinia

## Компоненты

### Компонент `Header`

Компонент `Header.vue` отвечает за отображение верхней навигационной панели приложения. Включает логотип, основную навигацию и мобильное меню.

#### Кратко о назначении
- Отображает навигационное меню сайта
- Адаптивен для мобильных устройств (имеет бургер-меню)
- Показывает разные элементы для авторизованных и неавторизованных пользователей

#### Объяснение кода в `Header.vue`

##### Шаблон (`<template>`)
- Содержит логотип с ссылкой на главную страницу
- Основное навигационное меню для десктопа
- Бургер-меню для мобильных устройств
- Условное отображение ссылок на профиль или авторизацию

##### Логика (`<script setup>`)
- Использует Composition API Vue 3
- Управляет состоянием мобильного меню (открыто/закрыто)
- Использует хранилище авторизации для проверки статуса пользователя
- Обрабатывает события изменения размера окна для адаптивности

##### Стили (`<style lang="scss" scoped>`)
- Адаптивные стили для разных размеров экрана
- Анимация для мобильного меню
- Стилизация навигационных элементов

#### Полный код компонента `Header.vue`

```vue
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
});
</script>
```

### Компонент `YandexMap`

Компонент `YandexMap.vue` отвечает за интеграцию и отображение Яндекс.Карты с местоположением автосервиса.

#### Кратко о назначении
- Отображает интерактивную карту с местоположением сервиса
- Добавляет кастомную метку на карту
- Обрабатывает загрузку API Яндекс.Карт

#### Объяснение кода в `YandexMap.vue`

##### Шаблон (`<template>`)
- Содержит контейнер для карты с соответствующими классами

##### Логика (`<script setup>`)
- Использует хуки жизненного цикла Vue для инициализации и очистки карты
- Динамически загружает API Яндекс.Карт
- Создает карту с кастомной меткой и информацией о сервисе

##### Стили (`<style lang="scss" scoped>`)
- Стилизация контейнера карты
- Кастомное оформление метки на карте

#### Полный код компонента `YandexMap.vue`

```vue
<template>
  <div class="map-container">
    <div id="map" class="yandex-map"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// Координаты местоположения (пример)
const coordinates = [60.123112, 64.810707]; // Сургут (примерные координаты)
const mapZoom = 16;
let map = null;
let placemark = null;

onMounted(() => {
  // Загрузка API Яндекс.Карт
  if (!window.ymaps) {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_API_ключ&lang=ru_RU';
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  } else {
    initMap();
  }
});

onUnmounted(() => {
  if (map) {
    map.destroy();
    map = null;
  }
});

function initMap() {
  if (window.ymaps) {
    window.ymaps.ready(() => {
      // Создание карты
      map = new window.ymaps.Map('map', {
        center: coordinates,
        zoom: mapZoom,
        controls: ['zoomControl', 'fullscreenControl']
      });

      // Создание кастомного макета для метки
      const squareLayout = window.ymaps.templateLayoutFactory.createClass(
        '<div class="custom-placemark"></div>'
      );

      // Создание метки с кастомным макетом
      placemark = new window.ymaps.Placemark(
        coordinates,
        {
          hintContent: 'OIL Сервис',
          balloonContent: 'ГСК "Нефтяник 2"<br>Тел: +7 908 896 66 00'
        },
        {
          iconLayout: squareLayout,
          iconShape: {
            type: 'Rectangle',
            coordinates: [[-20, -20], [20, 20]]
          }
        }
      );

      // Добавление метки на карту
      map.geoObjects.add(placemark);

      // Отключение скролла карты при скролле страницы
      map.behaviors.disable('scrollZoom');
    });
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 400px;
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  .yandex-map {
    width: 100%;
    height: 100%;
  }
}

:deep(.custom-placemark) {
  position: relative;
  width: 40px;
  height: 40px;
  background: #e74c3c;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #e74c3c;
  }
}
</style>
```

### Компонент `ServiceCard`

Компонент `ServiceCard.vue` отвечает за отображение карточки услуги на странице услуг.

#### Кратко о назначении
- Отображает информацию об услуге (название, описание, цена)
- Позволяет добавить услугу в корзину
- Показывает статус услуги (в корзине или нет)

#### Объяснение кода в `ServiceCard.vue`

##### Шаблон (`<template>`)
- Содержит изображение услуги
- Отображает название и описание услуги
- Показывает цену или статус "БЕСПЛАТНО"
- Включает кнопку для добавления в корзину

##### Логика (`<script setup>`)
- Принимает props с данными услуги
- Использует хранилище корзины для управления товарами
- Проверяет, находится ли услуга уже в корзине
- Обрабатывает добавление услуги в корзину

##### Стили (`<style lang="scss" scoped>`)
- Стилизация карточки услуги с эффектами при наведении
- Адаптивное отображение элементов
- Оформление кнопки добавления в корзину

#### Полный код компонента `ServiceCard.vue`

```vue
<template>
  <div class="service-card">
    <div class="service-image">
      <img :src="service.image || '/images/placeholder.png'" :alt="service.title" />
    </div>
    <div class="service-content">
      <h3>{{ service.title }}</h3>
      <p>{{ service.description }}</p>
      <div class="service-footer">
        <div class="service-price" v-if="service.price > 0">
          {{ service.price }} ₽
        </div>
        <div class="service-free" v-else>
          БЕСПЛАТНО!
        </div>
        <button 
          class="add-to-cart-btn" 
          @click="addToCart"
          :disabled="isInCart"
        >
          {{ isInCart ? 'В корзине' : 'Добавить в корзину' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '~/stores/cart';

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();

const isInCart = computed(() => {
  return cartStore.items.some(item => item.id === props.service.id);
});

const addToCart = () => {
  if (!isInCart.value) {
    cartStore.addItem(props.service);
  }
};
</script>

<style lang="scss" scoped>
.service-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  
  .service-image {
    height: 180px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .service-content {
    padding: 1.5rem;
    
    h3 {
      margin-top: 0;
      margin-bottom: 0.75rem;
      color: #333;
    }
    
    p {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .service-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .service-price {
        font-size: 1.25rem;
        font-weight: 600;
        color: #333;
      }
      
      .service-free {
        font-size: 1.25rem;
        font-weight: 600;
        color: #27ae60;
      }
      
      .add-to-cart-btn {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s;
        
        &:hover {
          background: darken(#e74c3c, 10%);
        }
        
        &:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
```

### Компонент `Footer`

Компонент `Footer.vue` отвечает за отображение нижней части сайта с контактной информацией, режимом работы и ссылками на социальные сети.

#### Кратко о назначении
- Отображает логотип и слоган сервиса
- Показывает контактную информацию и режим работы
- Содержит ссылки на социальные сети
- Отображает информацию об авторских правах

#### Объяснение кода в `Footer.vue`

##### Шаблон (`<template>`)
- Содержит логотип с ссылкой на главную страницу и слоган
- Блок с информацией о режиме работы, контактах и местоположении
- Блок с ссылками на социальные сети
- Нижняя часть с информацией об авторских правах

##### Логика (`<script setup>`)
- Минимальная логика, так как компонент преимущественно статический

##### Стили (`<style lang="scss" scoped>`)
- Стилизация футера с темным фоном
- Адаптивная верстка с использованием flexbox
- Стилизация ссылок и эффекты при наведении

#### Полный код компонента `Footer.vue`

```vue
<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo">
        <NuxtLink to="/">
          <h2>OIL Сервис</h2>
        </NuxtLink>
        <p class="slogan">Профессиональная замена масла</p>
      </div>
      <div class="footer-info">
        <div><strong>Режим работы:</strong> с 10:00 до 19:00 пн-вс (ежедневно)</div>
        <div><strong>Контакт:</strong> <NuxtLink to="tel:+79088966600">+7 908 896 66 00</NuxtLink></div>
        <div><strong>Местоположение:</strong> ГСК "Нефтяник 2"</div>
      </div>
      <div class="footer-social">
        <NuxtLink to="#" class="social-link">ВКонтакте</NuxtLink>
        <NuxtLink to="#" class="social-link">Telegram</NuxtLink>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 OIL Сервис. Все права защищены.</p>
    </div>
  </footer>
</template>

<script setup>
// Footer component
</script>

<style lang="scss" scoped>
.footer {
  background: #23272f;
  color: #fff;
  padding: 2rem 0 1rem 0;
  
  .footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    margin-bottom: 2rem;
    
    .footer-logo {
      flex: 1;
      min-width: 200px;
      
      a {
        text-decoration: none;
        display: inline-block;
      }
      
      h2 {
        color: #e76d3c;
        font-size: clamp(1.5rem, 5vw, 1.8rem);
        margin: 0 0 0.5rem 0;
        font-weight: 700;
        transition: color 0.3s;
        
        &:hover {
          color: lighten(#e76d3c, 10%);
        }
      }
      
      .slogan {
        color: #aaa;
        margin: 0;
        font-size: 0.9rem;
      }
    }
    
    .footer-info {
      flex: 1;
      min-width: 250px;
      
      a {
        color: #fff;
        text-decoration: none;
        transition: color 0.3s;
        
        &:hover {
          color: #e76d3c;
          text-decoration: none;
        }
      }
      
      div {
        margin-bottom: 0.75rem;
        line-height: 1.5;
      }
    }
    
    .footer-social {
      flex: 1;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      
      .social-link {
        color: #fff;
        text-decoration: none;
        transition: color 0.3s;
        display: inline-flex;
        align-items: center;
        
        &:hover {
          color: #e76d3c;
        }
      }
    }
  }
  
  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1rem;
    text-align: center;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    
    p {
      color: #aaa;
      font-size: 0.9rem;
      margin: 0;
    }
  }
  
  @media (max-width: 767px) {
    .footer-content {
      flex-direction: column;
      gap: 1.5rem;
    }
  }
}
</style>
```

### Компонент `LoginForm`

Компонент `LoginForm.vue` представляет собой форму авторизации пользователей в системе.

#### Кратко о назначении
- Предоставляет интерфейс для входа пользователей в личный кабинет
- Обрабатывает процесс авторизации через хранилище Pinia
- Отображает ошибки авторизации
- Содержит ссылку на страницу регистрации

#### Объяснение кода в `LoginForm.vue`

##### Шаблон (`<template>`)
- Форма с полями для ввода логина и пароля
- Кнопка отправки формы с индикацией загрузки
- Блок для отображения ошибок авторизации
- Ссылка на страницу регистрации

##### Логика (`<script setup>`)
- Использует хранилище авторизации для проверки учетных данных
- Управляет состоянием формы и отображением ошибок
- Перенаправляет пользователя после успешной авторизации в зависимости от роли

##### Стили (`<style lang="scss" scoped>`)
- Стилизация формы входа с тенями и скруглениями
- Оформление полей ввода и кнопки отправки
- Стилизация сообщений об ошибках

#### Полный код компонента `LoginForm.vue`

```vue
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
    margin-bottom: 1.25rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
      
      &:focus {
        outline: none;
        border-color: #e74c3c;
      }
    }
  }
  
  .error-message {
    color: #e74c3c;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    padding: 0.5rem;
    background: rgba(231, 76, 60, 0.1);
    border-radius: 4px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 0.75rem;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
    
    &:hover {
      background: darken(#e74c3c, 10%);
    }
    
    &:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }
  }
  
  .register-link {
    text-align: center;
    margin-top: 1.5rem;
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
```
## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```
