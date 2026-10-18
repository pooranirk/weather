<template>
  <div v-if="weather" class="current-card glass-card">
    <div class="ambient-glow" :class="`glow-${weather.condition.theme}`"></div>

    <div class="card-content">
      <!-- Location header -->
      <div class="header-row">
        <div class="location-group">
          <div class="city-title-wrap">
            <h2 class="city-name">{{ city.name }}</h2>
            <span v-if="city.country" class="country-pill">{{ city.country }}</span>
          </div>
          <p class="location-sub">
            <span v-if="city.admin1">{{ city.admin1 }} • </span>
            <span>Observed at {{ weather.time ? formatTime(weather.time) : 'Now' }}</span>
          </p>
        </div>

        <div class="condition-badge" :class="`badge-${weather.condition.theme}`">
          <span class="pulse-dot"></span>
          <span>{{ weather.condition.displayLabel }}</span>
        </div>
      </div>

      <!-- Main Weather Body -->
      <div class="weather-hero-row">
        <!-- Temp and stats -->
        <div class="temp-section">
          <div class="temp-display">
            <span class="temp-val">{{ displayTemp }}</span>
            <span class="temp-unit">°{{ unit }}</span>
          </div>
          <div class="temp-meta">
            <span class="feels-like">
              Feels like <strong>{{ displayFeelsLike }}°{{ unit }}</strong>
            </span>
            <span class="high-low">
              <span>↑ {{ displayMax }}°</span>
              <span>↓ {{ displayMin }}°</span>
            </span>
          </div>
          <p class="condition-desc">{{ weather.condition.description }}</p>
        </div>

        <!-- Big Animated Icon -->
        <div class="icon-section">
          <WeatherIcon 
            :icon="weather.condition.icon" 
            :isDay="weather.isDay" 
            size="hero" 
          />
        </div>
      </div>

      <!-- Quick summary pills -->
      <div class="weather-pills-row">
        <div class="summary-pill">
          <span class="pill-icon">💧</span>
          <span class="pill-label">Humidity</span>
          <span class="pill-val">{{ weather.humidity }}%</span>
        </div>
        <div class="summary-pill">
          <span class="pill-icon">💨</span>
          <span class="pill-label">Wind</span>
          <span class="pill-val">{{ weather.windSpeed }} km/h</span>
        </div>
        <div class="summary-pill">
          <span class="pill-icon">☀️</span>
          <span class="pill-label">UV Index</span>
          <span class="pill-val" :style="{ color: weather.uvRisk.color }">
            {{ weather.uvIndex }} ({{ weather.uvRisk.label }})
          </span>
        </div>
        <div class="summary-pill">
          <span class="pill-icon">🧭</span>
          <span class="pill-label">Pressure</span>
          <span class="pill-val">{{ weather.pressure }} hPa</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import WeatherIcon from './WeatherIcon.vue';
import { cToF, formatTime } from '../services/weatherService';

const props = defineProps({
  weather: {
    type: Object,
    required: true
  },
  city: {
    type: Object,
    required: true
  },
  unit: {
    type: String,
    default: 'C'
  }
});

const displayTemp = computed(() => {
  if (!props.weather) return '--';
  return props.unit === 'C'
    ? Math.round(props.weather.tempC)
    : cToF(props.weather.tempC);
});

const displayFeelsLike = computed(() => {
  if (!props.weather) return '--';
  return props.unit === 'C'
    ? Math.round(props.weather.feelsLikeC)
    : cToF(props.weather.feelsLikeC);
});

const displayMax = computed(() => {
  if (!props.weather) return '--';
  return props.unit === 'C'
    ? Math.round(props.weather.maxTempC)
    : cToF(props.weather.maxTempC);
});

const displayMin = computed(() => {
  if (!props.weather) return '--';
  return props.unit === 'C'
    ? Math.round(props.weather.minTempC)
    : cToF(props.weather.minTempC);
});
</script>

<style scoped>
.current-card {
  position: relative;
  overflow: hidden;
  padding: 32px;
  border-radius: 28px;
  margin-bottom: 24px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
}

/* Dynamic Ambient Glow */
.ambient-glow {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.35;
  pointer-events: none;
  transition: all 1s ease;
}

.glow-clear-day { background: #f59e0b; }
.glow-clear-night { background: #6366f1; }
.glow-cloudy-day { background: #38bdf8; }
.glow-cloudy-night { background: #475569; }
.glow-rain { background: #0284c7; }
.glow-thunderstorm { background: #a855f7; }
.glow-snow { background: #e0f2fe; }
.glow-fog { background: #94a3b8; }

.card-content {
  position: relative;
  z-index: 2;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.city-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.city-name {
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.country-pill {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  color: #cbd5e1;
}

.location-sub {
  font-size: 14px;
  color: #94a3b8;
  margin: 6px 0 0;
}

.condition-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f8fafc;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.8; }
}

.weather-hero-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  gap: 20px;
}

.temp-section {
  display: flex;
  flex-direction: column;
}

.temp-display {
  display: flex;
  align-items: flex-start;
  font-family: var(--font-display);
  font-weight: 800;
  color: #ffffff;
  line-height: 0.9;
}

.temp-val {
  font-size: 88px;
  letter-spacing: -3px;
}

.temp-unit {
  font-size: 38px;
  font-weight: 500;
  color: #38bdf8;
  margin-top: 6px;
  margin-left: 4px;
}

.temp-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 14px;
  font-size: 15px;
  color: #cbd5e1;
}

.high-low {
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.08);
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 600;
  color: #f1f5f9;
}

.condition-desc {
  font-size: 15px;
  color: #94a3b8;
  margin: 12px 0 0;
  max-width: 400px;
}

.icon-section {
  padding-right: 20px;
}

/* Bottom summary pills */
.weather-pills-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-pill {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px 14px;
  transition: all 0.2s ease;
}

.summary-pill:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.pill-icon {
  font-size: 18px;
  margin-bottom: 4px;
}

.pill-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.pill-val {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .current-card {
    padding: 22px;
    border-radius: 22px;
  }
  .weather-hero-row {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
  .temp-val {
    font-size: 64px;
  }
  .temp-unit {
    font-size: 28px;
  }
  .city-name {
    font-size: 26px;
  }
  .icon-section {
    padding: 0;
    margin-bottom: 10px;
    align-self: center;
  }
}
</style>
