<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <h1>OIL Сервис</h1>
        <p class="hero-subtitle">Профессиональное обслуживание вашего автомобиля</p>
        <NuxtLink to="/services" class="cta-button">Выбрать услуги</NuxtLink>
      </div>
    </section>
    
    <section class="services-overview">
      <div class="container">
        <h2>Наши услуги</h2>
        <div class="services-grid">
          <div class="service-item" v-for="(service, index) in featuredServices" :key="index">
            <div class="service-icon">
              <img :src="service.icon || '/images/placeholder.png'" :alt="service.title">
            </div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <div v-if="service.isFree" class="free-label">БЕСПЛАТНО!</div>
          </div>
        </div>
        <div class="view-all">
          <NuxtLink to="/services" class="view-all-link">Посмотреть все услуги</NuxtLink>
        </div>
      </div>
    </section>
    
    <section class="about-us">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>О нас</h2>
            <p>OIL Сервис предлагает широкий спектр услуг по обслуживанию вашего автомобиля. Мы специализируемся на экспресс-замене масла, диагностике и мелком ремонте.</p>
            <p>Наши преимущества:</p>
            <ul>
              <li>Бесплатная замена масла при покупке у нас</li>
              <li>Бесплатная диагностика ходовой части</li>
              <li>Высококвалифицированные специалисты</li>
              <li>Быстрое и качественное обслуживание</li>
              <li>Удобное расположение</li>
            </ul>
          </div>
          <div class="about-image">
            <img src="/images/placeholder.png" alt="OIL Сервис">
          </div>
        </div>
      </div>
    </section>
    
    <section class="contact-info">
      <div class="container">
        <h2>Наше место нахождение</h2>
        <div class="map-container">
          <YandexMap/>
        </div>
        <h2>Контактная информация</h2>
        <div class="contact-grid">
          <div class="contact-item">
            <h3>Режим работы</h3>
            <p>с 10:00 до 19:00 пн-вс</p>
            <p>Ежедневно!</p>
          </div>
          <div class="contact-item">
            <h3>Телефон</h3>
            <p><a href="tel:+79088966600">+7 908 896 66 00</a></p>
          </div>
          <div class="contact-item">
            <h3>Местоположение</h3>
            <p>ГСК "Нефтяник 2"</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const featuredServices = [
  {
    title: 'Экспресс замена масла в ДВС',
    description: 'Быстрая и профессиональная замена масла в двигателе вашего автомобиля.',
    icon: '/images/placeholder.png',
    isFree: true
  },
  {
    title: 'Диагностика ходовой части',
    description: 'Полная проверка состояния подвески, рулевого управления и тормозной системы.',
    icon: '/images/placeholder.png',
    isFree: true
  },
  {
    title: 'Компьютерная диагностика',
    description: 'Выявление неисправностей электронных систем автомобиля с помощью специального оборудования.',
    icon: '/images/placeholder.png',
    isFree: false
  },
  {
    title: 'Замена фильтров',
    description: 'Замена масляного, воздушного, салонного и топливного фильтров.',
    icon: '/images/placeholder.png',
    isFree: false
  }
];
</script>

<style lang="scss" scoped>
.home-page {
  .hero {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/placeholder.png');
    background-size: cover;
    background-position: center;
    color: white;
    padding: 5rem 1rem;
    text-align: center;
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      
      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      
      .hero-subtitle {
        font-size: 1.5rem;
        margin-bottom: 2rem;
      }
      
      .cta-button {
        display: inline-block;
        background: #e74c3c;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-size: 1.1rem;
        font-weight: 500;
        text-decoration: none;
        transition: background 0.3s;
        
        &:hover {
          background: darken(#e74c3c, 10%);
        }
      }
    }
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  section {
    padding: 4rem 0;
    
    h2 {
      text-align: center;
      margin-bottom: 2.5rem;
      color: #333;
      font-size: 2rem;
    }
  }
  
  .services-overview {
    background: #f9f9f9;
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      
      .service-item {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        text-align: center;
        position: relative;
        transition: transform 0.3s, box-shadow 0.3s;
        
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        
        .service-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }
        }
        
        h3 {
          margin-bottom: 0.75rem;
          color: #333;
        }
        
        p {
          color: #666;
          margin-bottom: 1rem;
        }
        
        .free-label {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #27ae60;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
      }
    }
    
    .view-all {
      text-align: center;
      margin-top: 2rem;
      
      .view-all-link {
        display: inline-block;
        color: #e74c3c;
        text-decoration: none;
        font-weight: 500;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  
  .about-us {
    .about-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      
      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
      }
      
      .about-text {
        flex: 1;
        
        h2 {
          text-align: left;
          margin-bottom: 1.5rem;
        }
        
        p {
          margin-bottom: 1rem;
          color: #666;
          line-height: 1.6;
        }
        
        ul {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          
          li {
            margin-bottom: 0.5rem;
            color: #666;
          }
        }
      }
      
      .about-image {
        flex: 1;
        
        img {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  
  .contact-info {
    background: #f9f9f9;
    
    .contact-grid {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2rem;
      @media (max-width: 600px) {
        flex-direction: column;
        align-items: center;
      }
      
      .contact-item {
        max-width: 250px;
        width: 100%;
        text-align: center;
        
        h3 {
          margin-bottom: 0.75rem;
          color: #333;
        }
        
        p {
          color: #666;
          margin-bottom: 0.5rem;
          
          a {
            color: #e74c3c;
            text-decoration: none;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
    
    .map-container {
      .location-map {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
