<template>
  <div class="app-atmosphere" :class="themeClass">
    <!-- Subtle rain particle layer when rainy -->
    <div v-if="isRainyTheme" class="rain-particles-canvas"></div>

    <div class="app-container">
      <!-- Navbar -->
      <Navbar 
        v-model:unit="unit" 
        :loading="loading" 
        @refresh="refreshWeather" 
      />

      <!-- Search & Autocomplete bar -->
      <WeatherSearch 
        :current-city-name="currentCity.name"
        @select-city="onSelectCity"
        @use-geolocation="onUseGeolocation"
        @notify-error="showErrorToast"
      />

      <!-- Main Loading Skeleton -->
      <div v-if="loading && !weatherData" class="loading-state-wrapper">
        <div class="skeleton-box skeleton-hero"></div>
        <div class="skeleton-grid">
          <div class="skeleton-box skeleton-metric" v-for="n in 4" :key="n"></div>
        </div>
      </div>

      <!-- Main Weather Dashboard -->
      <main v-else-if="weatherData" class="dashboard-content">
        <!-- Hero Weather View -->
        <CurrentWeather 
          :weather="weatherData.current" 
          :city="currentCity" 
          :unit="unit" 
        />

        <!-- Detailed Atmospheric Indicators -->
        <WeatherMetrics 
          :weather="weatherData.current" 
        />

        <!-- 24-Hour Hourly Forecast -->
        <HourlyForecast 
          :hourly="weatherData.hourly" 
          :unit="unit" 
        />

        <!-- 7-Day Extended Forecast -->
        <DailyForecast 
          :daily="weatherData.daily" 
          :unit="unit" 
        />
      </main>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="error-display-card glass-card">
        <div class="error-icon">⚠️</div>
        <h3 class="error-heading">Failed to fetch weather data</h3>
        <p class="error-text">{{ errorMessage }}</p>
        <button class="retry-btn" @click="loadWeather(currentCity)">
          Try Again
        </button>
      </div>

      <!-- Footer -->
      <footer class="app-footer">
        <p><strong>SkyCast</strong> • Real-time atmospheric forecasts powered by Open-Meteo</p>
      </footer>
    </div>

    <!-- Error Toast Notification -->
    <transition name="toast-fade">
      <div v-if="toastMessage" class="toast-banner">
        <span>⚠️ {{ toastMessage }}</span>
        <button class="toast-close" @click="toastMessage = ''">✕</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import WeatherSearch from './components/WeatherSearch.vue';
import CurrentWeather from './components/CurrentWeather.vue';
import WeatherMetrics from './components/WeatherMetrics.vue';
import HourlyForecast from './components/HourlyForecast.vue';
import DailyForecast from './components/DailyForecast.vue';

import { 
  getWeatherData, 
  reverseGeocode 
} from './services/weatherService';

// Default initial city: Chennai, India
const DEFAULT_CITY = {
  name: 'Chennai',
  country: 'India',
  admin1: 'Tamil Nadu',
  lat: 13.0827,
  lon: 80.2707
};

const currentCity = ref(DEFAULT_CITY);
const weatherData = ref(null);
const loading = ref(false);
const errorMessage = ref(null);
const toastMessage = ref('');
const unit = ref('C');

let toastTimer = null;

// Dynamic atmospheric theme based on condition
const themeClass = computed(() => {
  if (!weatherData.value || !weatherData.value.current) return 'theme-clear-day';
  return `theme-${weatherData.value.current.condition.theme}`;
});

const isRainyTheme = computed(() => {
  return themeClass.value.includes('rain') || themeClass.value.includes('thunderstorm');
});

/**
 * Core method: Fetch weather data using native fetch API
 */
async function loadWeather(city) {
  loading.value = true;
  errorMessage.value = null;

  try {
    // Native fetch API call inside getWeatherData
    const data = await getWeatherData(city.lat, city.lon);
    weatherData.value = data;
    currentCity.value = { ...city };

    // Persist in localStorage
    try {
      localStorage.setItem('skypulse_last_city', JSON.stringify(city));
    } catch (e) {
      // LocalStorage access might fail in private browsing
    }
  } catch (err) {
    console.error('Failed to load weather:', err);
    errorMessage.value = err.message || 'Unable to connect to weather service. Please check your internet connection.';
    showErrorToast(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function refreshWeather() {
  if (currentCity.value) {
    loadWeather(currentCity.value);
  }
}

function onSelectCity(city) {
  loadWeather(city);
}

/**
 * Handle Geolocation with Reverse Geocoding via Fetch API
 */
async function onUseGeolocation(coords) {
  loading.value = true;
  try {
    // Native fetch call to reverse geocode GPS coords to city name
    const geoInfo = await reverseGeocode(coords.lat, coords.lon);
    const resolvedCity = {
      name: geoInfo.name || 'My Location',
      country: geoInfo.country || '',
      admin1: geoInfo.admin1 || '',
      lat: coords.lat,
      lon: coords.lon
    };
    await loadWeather(resolvedCity);
  } catch (err) {
    showErrorToast('Could not resolve location name. Using coordinates.');
    await loadWeather({
      name: 'Current Location',
      country: '',
      lat: coords.lat,
      lon: coords.lon
    });
  }
}

function showErrorToast(msg) {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = '';
  }, 4500);
}

onMounted(() => {
  // Load saved city or default
  try {
    const saved = localStorage.getItem('skypulse_last_city');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.lat && parsed.lon) {
        currentCity.value = parsed;
      }
    }
  } catch (e) {
    // ignore
  }

  loadWeather(currentCity.value);
});
</script>

<style scoped>
.loading-state-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.skeleton-hero {
  height: 280px;
  border-radius: 28px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.skeleton-metric {
  height: 140px;
  border-radius: 20px;
}

/* Error Display Card */
.error-display-card {
  padding: 40px 24px;
  border-radius: 24px;
  text-align: center;
  max-width: 480px;
  margin: 40px auto;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.error-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.error-heading {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.error-text {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 20px;
}

.retry-btn {
  background: #38bdf8;
  border: none;
  color: #0f172a;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #0ea5e9;
  transform: translateY(-1px);
}

.footer-link-btn {
  background: transparent;
  border: none;
  color: #38bdf8;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.footer-link-btn:hover {
  color: #7dd3fc;
}

/* Toast Animation */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
