<template>
  <div v-if="daily && daily.length" class="daily-section glass-card">
    <div class="section-header">
      <div class="header-left">
        <span class="section-icon">📅</span>
        <h3 class="section-title">7-Day Extended Forecast</h3>
      </div>
      <span class="forecast-hint">Weekly Outlook</span>
    </div>

    <div class="daily-list">
      <div 
        v-for="(day, idx) in daily" 
        :key="day.date" 
        class="daily-row"
        :class="{ 'is-today': idx === 0 }"
      >
        <!-- Day & Date -->
        <div class="day-col">
          <span class="day-name">{{ day.dayName }}</span>
          <span class="day-date">{{ day.fullDate }}</span>
        </div>

        <!-- Condition & Icon -->
        <div class="condition-col">
          <WeatherIcon :icon="day.condition.icon" :isDay="true" size="sm" />
          <span class="condition-text">{{ day.condition.label }}</span>
        </div>

        <!-- Rain chance -->
        <div class="rain-col">
          <span v-if="day.precipProb > 0" class="daily-rain-tag">
            💧 {{ day.precipProb }}%
          </span>
          <span v-else class="dry-tag">—</span>
        </div>

        <!-- Min / Max temperature with visual bar -->
        <div class="temp-range-col">
          <span class="temp-min">{{ formatTemp(day.minTemp) }}°</span>

          <div class="range-bar-track">
            <div 
              class="range-bar-fill" 
              :style="calcRangeBarStyle(day.minTemp, day.maxTemp)"
            ></div>
          </div>

          <span class="temp-max">{{ formatTemp(day.maxTemp) }}°</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import WeatherIcon from './WeatherIcon.vue';
import { cToF } from '../services/weatherService';

const props = defineProps({
  daily: {
    type: Array,
    default: () => []
  },
  unit: {
    type: String,
    default: 'C'
  }
});

function formatTemp(tempC) {
  if (tempC === null || tempC === undefined) return '--';
  return props.unit === 'C' ? Math.round(tempC) : cToF(tempC);
}

// Global min and max across all 7 days for proportional bar visualization
const weekExtremes = computed(() => {
  if (!props.daily.length) return { min: 0, max: 40 };
  const allMins = props.daily.map((d) => d.minTemp);
  const allMaxs = props.daily.map((d) => d.maxTemp);
  return {
    min: Math.min(...allMins),
    max: Math.max(...allMaxs)
  };
});

function calcRangeBarStyle(min, max) {
  const globalMin = weekExtremes.value.min;
  const globalMax = weekExtremes.value.max;
  const totalRange = Math.max(1, globalMax - globalMin);

  const leftPercent = Math.max(0, Math.min(100, ((min - globalMin) / totalRange) * 100));
  const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((max - min) / totalRange) * 100));

  return {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`
  };
}
</script>

<style scoped>
.daily-section {
  padding: 24px;
  border-radius: 24px;
  margin-bottom: 24px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.forecast-hint {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.daily-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.daily-row {
  display: grid;
  grid-template-columns: 110px 1.4fr 80px 2fr;
  align-items: center;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.2s ease;
}

.daily-row:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
  transform: translateX(2px);
}

.daily-row.is-today {
  background: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.3);
}

.day-col {
  display: flex;
  flex-direction: column;
}

.day-name {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.day-date {
  font-size: 12px;
  color: #94a3b8;
}

.condition-col {
  display: flex;
  align-items: center;
  gap: 10px;
}

.condition-text {
  font-size: 14px;
  color: #cbd5e1;
  font-weight: 500;
}

.rain-col {
  display: flex;
  justify-content: center;
}

.daily-rain-tag {
  font-size: 12px;
  font-weight: 600;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
  padding: 2px 8px;
  border-radius: 8px;
}

.dry-tag {
  color: #64748b;
  font-size: 13px;
}

.temp-range-col {
  display: flex;
  align-items: center;
  gap: 12px;
}

.temp-min {
  font-size: 14px;
  color: #94a3b8;
  width: 32px;
  text-align: right;
  font-weight: 600;
}

.temp-max {
  font-size: 15px;
  color: #ffffff;
  width: 32px;
  font-weight: 700;
}

.range-bar-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.range-bar-fill {
  position: absolute;
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(90deg, #38bdf8 0%, #f59e0b 100%);
  transition: all 0.5s ease;
}

@media (max-width: 768px) {
  .daily-row {
    grid-template-columns: 80px 1fr 120px;
    gap: 8px;
  }
  .rain-col {
    display: none;
  }
  .condition-text {
    display: none;
  }
}
</style>
