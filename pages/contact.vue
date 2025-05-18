<template>
  <div class="contact-page">
    <div class="container">
      <h1>Контакты</h1>
      
      <div class="contact-grid">
        <div class="contact-info">
          <div class="info-card">
            <h2>Наш адрес</h2>
            <p>ГСК "Нефтяник 2"</p>
            <p>г. Сургут</p>
          </div>
          
          <div class="info-card">
            <h2>Режим работы</h2>
            <p>Ежедневно с 10:00 до 19:00</p>
            <p>Без выходных</p>
          </div>
          
          <div class="info-card">
            <h2>Контактный телефон</h2>
            <p><a href="tel:+79088966600">+7 908 896 66 00</a></p>
          </div>
          
          <div class="info-card">
            <h2>Социальные сети</h2>
            <div class="social-links">
              <a href="#" class="social-link">ВКонтакте</a>
              <a href="#" class="social-link">Telegram</a>
              <a href="#" class="social-link">WhatsApp</a>
            </div>
          </div>
        </div>
        
        <YandexMap />
      </div>
    </div>
  </div>
</template>

<script setup>
import YandexMap from '~/components/YandexMap.vue';
</script>

<style lang="scss" scoped>
.contact-page {
  padding: 2rem 0 4rem;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  h1 {
    margin-bottom: 2rem;
    color: #333;
    text-align: center;
  }
  
  .contact-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    
    .contact-info {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      
      .info-card {
        background: #fff;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        
        h2 {
          color: #e74c3c;
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }
        
        p {
          margin: 0.5rem 0;
          color: #333;
          
          a {
            color: #333;
            text-decoration: none;
            transition: color 0.3s;
            
            &:hover {
              color: #e74c3c;
            }
          }
        }
        
        .social-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          
          .social-link {
            color: #333;
            text-decoration: none;
            transition: color 0.3s;
            
            &:hover {
              color: #e74c3c;
            }
          }
        }
      }
    }
    
    YandexMap {
      flex: 1;
      min-width: 300px;
    }
  }
  
  @media (max-width: 767px) {
    .contact-grid {
      flex-direction: column;
    }
  }
}
</style>
