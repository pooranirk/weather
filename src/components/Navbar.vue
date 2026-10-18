<template>
  <header class="app-navbar glass-card">
    <div class="nav-brand">
      <div class="brand-icon">
        <svg viewBox="0 0 36 36" class="brand-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoSun" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fde047" />
              <stop offset="100%" stop-color="#f97316" />
            </linearGradient>
            <linearGradient id="logoCloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#93c5fd" />
            </linearGradient>
            <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0284c7" flood-opacity="0.3" />
            </filter>
          </defs>
          <!-- Sun -->
          <circle cx="23" cy="13" r="7.5" fill="url(#logoSun)" />
          <!-- Sun ray accents -->
          <line x1="23" y1="2" x2="23" y2="4.5" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" />
          <line x1="31" y1="6" x2="29.2" y2="7.8" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" />
          <line x1="34" y1="13" x2="31.5" y2="13" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" />
          <!-- Front Cloud -->
          <path 
            d="M26 27H11a6 6 0 0 1-1.2-11.88A7.5 7.5 0 0 1 24.3 13.8 5.5 5.5 0 0 1 26 27z" 
            fill="url(#logoCloud)" 
            filter="url(#logoShadow)" 
          />
        </svg>
      </div>
      <div class="brand-text">
        <h1 class="brand-title">SkyCast</h1>
      </div>
    </div>

    <!-- Live clock & Date -->
    <div class="nav-center">
      <div class="live-clock">
        <span class="clock-time">{{ liveTime }}</span>
        <span class="clock-date">{{ liveDate }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="nav-actions">
      <!-- Unit switch (°C / °F) -->
      <div class="unit-toggle" role="group" aria-label="Temperature unit selector">
        <button 
          type="button" 
          class="unit-btn" 
          :class="{ active: unit === 'C' }" 
          @click="$emit('update:unit', 'C')"
        >
          °C
        </button>
        <button 
          type="button" 
          class="unit-btn" 
          :class="{ active: unit === 'F' }" 
          @click="$emit('update:unit', 'F')"
        >
          °F
        </button>
      </div>

      <!-- Refresh button -->
      <button 
        class="refresh-btn" 
        :class="{ 'is-loading': loading }" 
        @click="$emit('refresh')" 
        title="Refresh Current Weather"
        :disabled="loading"
      >
        <svg viewBox="0 0 24 24" class="btn-svg" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

defineProps({
  unit: {
    type: String,
    default: 'C'
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:unit', 'refresh']);

const liveTime = ref('');
const liveDate = ref('');
let timerId = null;

function updateClock() {
  const now = new Date();
  liveTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  liveDate.value = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

onMounted(() => {
  updateClock();
  timerId = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  if (timerId) clearInterval(timerId);
});
</script>

<style scoped>
.app-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-radius: 20px;
  margin-bottom: 24px;
  position: relative;
  z-index: 20;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(99, 102, 241, 0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 14px rgba(56, 189, 248, 0.25);
}

.brand-logo-svg {
  width: 32px;
  height: 32px;
  overflow: visible;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0;
  line-height: 1;
  background: linear-gradient(135deg, #ffffff 40%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-center {
  display: flex;
  align-items: center;
}

.live-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 6px 16px;
  border-radius: 12px;
}

.clock-time {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #f8fafc;
}

.clock-date {
  font-size: 11px;
  color: #94a3b8;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.unit-toggle {
  display: flex;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 3px;
}

.unit-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.unit-btn.active {
  background: #38bdf8;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.4);
}

.unit-btn:hover:not(.active) {
  color: #f1f5f9;
}

.refresh-btn {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  transform: rotate(45deg);
}

.refresh-btn.is-loading .btn-svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .app-navbar {
    padding: 12px 16px;
  }
  .nav-center {
    display: none;
  }
}
</style>
