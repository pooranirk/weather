<template>
  <div v-if="hourly && hourly.length" class="forecast-section glass-card">
    <div class="section-header">
      <div class="header-left">
        <span class="section-icon">⏱️</span>
        <h3 class="section-title">24-Hour Hourly Forecast</h3>
      </div>
      <div class="scroll-actions">
        <button class="scroll-btn" @click="scrollHoriz(-240)" title="Scroll Left">‹</button>
        <button class="scroll-btn" @click="scrollHoriz(240)" title="Scroll Right">›</button>
      </div>
    </div>

    <!-- Horizontal scroll container -->
    <div ref="scrollContainer" class="hourly-cards-scroll">
      <div 
        v-for="(item, idx) in hourly" 
        :key="item.time" 
        class="hour-item"
        :class="{ 'is-first-hour': idx === 0 }"
      >
        <span class="hour-time">{{ idx === 0 ? 'Now' : item.displayTime }}</span>
        
        <div class="hour-icon-box">
          <WeatherIcon 
            :icon="item.condition.icon" 
            :isDay="item.condition.isDay" 
            size="sm" 
          />
        </div>

        <span class="hour-temp">{{ formatTemp(item.temperature) }}°</span>

        <!-- Rain chance badge -->
        <div class="hour-rain-pill" :class="{ 'has-rain': item.precipitationProb > 0 }">
          <span class="rain-icon">💧</span>
          <span>{{ item.precipitationProb }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WeatherIcon from './WeatherIcon.vue';
import { cToF } from '../services/weatherService';

const props = defineProps({
  hourly: {
    type: Array,
    default: () => []
  },
  unit: {
    type: String,
    default: 'C'
  }
});

const scrollContainer = ref(null);

function formatTemp(tempC) {
  if (tempC === null || tempC === undefined) return '--';
  return props.unit === 'C' ? Math.round(tempC) : cToF(tempC);
}

function scrollHoriz(offset) {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: offset, behavior: 'smooth' });
  }
}
</script>

<style scoped>
.forecast-section {
  padding: 22px;
  border-radius: 24px;
  margin-bottom: 24px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  font-size: 20px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.scroll-actions {
  display: flex;
  gap: 6px;
}

.scroll-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.scroll-btn:hover {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border-color: #38bdf8;
}

.hourly-cards-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 2px 14px;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: rgba(56, 189, 248, 0.3) rgba(255, 255, 255, 0.05);
}

.hourly-cards-scroll::-webkit-scrollbar {
  height: 6px;
}

.hourly-cards-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.hourly-cards-scroll::-webkit-scrollbar-thumb {
  background: rgba(56, 189, 248, 0.35);
  border-radius: 10px;
}

.hour-item {
  flex: 0 0 88px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 10px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.hour-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.hour-item.is-first-hour {
  background: rgba(56, 189, 248, 0.15);
  border-color: rgba(56, 189, 248, 0.35);
}

.hour-time {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 8px;
}

.hour-icon-box {
  margin: 6px 0;
  height: 32px;
  display: flex;
  align-items: center;
}

.hour-temp {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 4px 0 8px;
}

.hour-rain-pill {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  padding: 2px 6px;
  border-radius: 10px;
}

.hour-rain-pill.has-rain {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
}

.rain-icon {
  font-size: 10px;
}
</style>
