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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
  }
}
</style>
