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
        
        &:before {
          content: '•';
          margin-right: 0.5rem;
          color: #e76d3c;
        }
        
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
    padding: 1rem;
    
    p {
      margin: 0;
      font-size: 0.85rem;
      color: #aaa;
    }
  }
  
  @media (max-width: 767px) {
    padding: 1.5rem 0 1rem 0;
    
    .footer-content {
      flex-direction: column;
      text-align: center;
      gap: 1.5rem;
      padding: 0 1rem;
      
      .footer-social {
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem 2rem;
      }
    }
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0 0.5rem 0;
    
    .footer-content {
      gap: 1.25rem;
      margin-bottom: 1.5rem;
      
      .footer-logo {
        h2 {
          margin-bottom: 0.25rem;
        }
      }
      
      .footer-info {
        div {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
      }
      
      .footer-social {
        .social-link {
          font-size: 0.9rem;
        }
      }
    }
    
    .footer-bottom {
      padding: 0.75rem;
      
      p {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
