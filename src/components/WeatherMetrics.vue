<template>
  <div v-if="weather" class="metrics-grid">
    <!-- Wind Card -->
    <div class="metric-card glass-card">
      <div class="metric-top">
        <span class="metric-title">Wind Status</span>
        <span class="metric-badge">Real-time</span>
      </div>
      <div class="metric-body">
        <div class="metric-val-wrap">
          <span class="metric-number">{{ weather.windSpeed }}</span>
          <span class="metric-sub-unit">km/h</span>
        </div>
        <div class="wind-direction-wrap">
          <div 
            class="compass-arrow" 
            :style="{ transform: `rotate(${weather.windDirection}deg)` }"
            title="Wind direction vector"
          >
            ▲
          </div>
          <span class="direction-text">{{ weather.windDirectionLabel }} ({{ weather.windDirection }}°)</span>
        </div>
      </div>
      <div class="metric-footer">
        <span class="footer-note">{{ getWindDescription(weather.windSpeed) }}</span>
      </div>
    </div>

    <!-- Humidity Card -->
    <div class="metric-card glass-card">
      <div class="metric-top">
        <span class="metric-title">Humidity</span>
        <span class="metric-badge">{{ getHumidityStatus(weather.humidity) }}</span>
      </div>
      <div class="metric-body">
        <div class="metric-val-wrap">
          <span class="metric-number">{{ weather.humidity }}</span>
          <span class="metric-sub-unit">%</span>
        </div>
        <!-- Progress bar -->
        <div class="meter-bar">
          <div class="meter-fill humidity-fill" :style="{ width: `${weather.humidity}%` }"></div>
        </div>
      </div>
      <div class="metric-footer">
        <span class="footer-note">Dew point is comfortable</span>
      </div>
    </div>

    <!-- UV Index Card -->
    <div class="metric-card glass-card">
      <div class="metric-top">
        <span class="metric-title">UV Index</span>
        <span 
          class="metric-badge" 
          :style="{ backgroundColor: weather.uvRisk.color + '22', color: weather.uvRisk.color, borderColor: weather.uvRisk.color }"
        >
          {{ weather.uvRisk.label }}
        </span>
      </div>
      <div class="metric-body">
        <div class="metric-val-wrap">
          <span class="metric-number">{{ weather.uvIndex }}</span>
          <span class="metric-sub-unit">/ 11+</span>
        </div>
        <!-- UV spectrum bar -->
        <div class="meter-bar uv-track">
          <div 
            class="uv-indicator" 
            :style="{ left: `${Math.min(100, (weather.uvIndex / 11) * 100)}%` }"
          ></div>
        </div>
      </div>
      <div class="metric-footer">
        <span class="footer-note">{{ weather.uvRisk.advice }}</span>
      </div>
    </div>

    <!-- Barometric Pressure Card -->
    <div class="metric-card glass-card">
      <div class="metric-top">
        <span class="metric-title">Air Pressure</span>
        <span class="metric-badge">Sea level</span>
      </div>
      <div class="metric-body">
        <div class="metric-val-wrap">
          <span class="metric-number">{{ weather.pressure }}</span>
          <span class="metric-sub-unit">hPa</span>
        </div>
        <div class="pressure-range-indicator">
          <span>Low (980)</span>
          <div class="pressure-bar">
            <div class="pressure-point" :style="{ left: `${calcPressurePercent(weather.pressure)}%` }"></div>
          </div>
          <span>High (1040)</span>
        </div>
      </div>
      <div class="metric-footer">
        <span class="footer-note">{{ weather.pressure >= 1013 ? 'High pressure (Fair weather)' : 'Low pressure (Precipitation likely)' }}</span>
      </div>
    </div>

    <!-- Sun Cycle (Sunrise & Sunset) -->
    <div class="metric-card glass-card span-two-if-large">
      <div class="metric-top">
        <span class="metric-title">Sun Schedule</span>
        <span class="metric-badge">Astronomy</span>
      </div>
      <div class="sun-schedule-grid">
        <div class="sun-time-block">
          <span class="sun-icon">🌅</span>
          <div class="sun-info">
            <span class="sun-label">Sunrise</span>
            <span class="sun-val">{{ weather.displaySunrise }}</span>
          </div>
        </div>
        <div class="sun-divider">
          <div class="sun-arc-visual"></div>
        </div>
        <div class="sun-time-block">
          <span class="sun-icon">🌇</span>
          <div class="sun-info">
            <span class="sun-label">Sunset</span>
            <span class="sun-val">{{ weather.displaySunset }}</span>
          </div>
        </div>
      </div>
      <div class="metric-footer">
        <span class="footer-note">Natural daylight schedule based on local coordinates</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  weather: {
    type: Object,
    required: true
  }
});

function getWindDescription(speed) {
  if (speed < 5) return 'Calm - smoke rises vertically';
  if (speed < 15) return 'Light breeze - leaves rustle';
  if (speed < 25) return 'Moderate breeze - small branches move';
  if (speed < 40) return 'Fresh to strong breeze - umbrella hard to hold';
  return 'Gale force - caution recommended';
}

function getHumidityStatus(h) {
  if (h < 30) return 'Dry';
  if (h <= 60) return 'Optimal';
  if (h <= 80) return 'Humid';
  return 'Very High';
}

function calcPressurePercent(hpa) {
  const min = 980;
  const max = 1040;
  const clamped = Math.max(min, Math.min(max, hpa));
  return ((clamped - min) / (max - min)) * 100;
}
</script>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.span-two-if-large {
  grid-column: span 2;
}

@media (max-width: 640px) {
  .span-two-if-large {
    grid-column: span 1;
  }
}

.metric-card {
  padding: 20px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.25s ease;
}

.metric-card:hover {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
}

.metric-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-title {
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
}

.metric-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.metric-body {
  margin: 8px 0;
}

.metric-val-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.metric-number {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.metric-sub-unit {
  font-size: 14px;
  font-weight: 500;
  color: #94a3b8;
}

.wind-direction-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.compass-arrow {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  transition: transform 0.4s ease;
}

.direction-text {
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
}

/* Meter / Progress bars */
.meter-bar {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  margin-top: 14px;
  position: relative;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.humidity-fill {
  background: linear-gradient(90deg, #38bdf8, #0284c7);
}

.uv-track {
  background: linear-gradient(90deg, #10b981 0%, #f59e0b 35%, #f97316 65%, #ef4444 85%, #a855f7 100%);
  overflow: visible;
}

.uv-indicator {
  position: absolute;
  top: -3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #0f172a;
  transform: translateX(-50%);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.pressure-range-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 11px;
  color: #64748b;
}

.pressure-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  position: relative;
}

.pressure-point {
  position: absolute;
  top: -3px;
  width: 12px;
  height: 12px;
  background: #38bdf8;
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 6px #38bdf8;
  transition: left 0.5s ease;
}

/* Sun schedule */
.sun-schedule-grid {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 12px 0;
  gap: 16px;
}

.sun-time-block {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sun-icon {
  font-size: 28px;
}

.sun-info {
  display: flex;
  flex-direction: column;
}

.sun-label {
  font-size: 12px;
  color: #94a3b8;
}

.sun-val {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.sun-divider {
  flex: 1;
  display: flex;
  justify-content: center;
}

.sun-arc-visual {
  width: 80%;
  height: 24px;
  border-top: 2px dashed rgba(245, 158, 11, 0.4);
  border-radius: 50% 50% 0 0;
}

.metric-footer {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-note {
  font-size: 12px;
  color: #94a3b8;
}
</style>
