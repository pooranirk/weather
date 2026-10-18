<template>
  <div class="weather-icon-wrapper" :class="[sizeClass, customClass]">
    <!-- Clear Day / Sun -->
    <svg v-if="iconName === 'clear' && isDay" viewBox="0 0 64 64" class="svg-weather svg-sun">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff7a1" />
          <stop offset="100%" stop-color="#f59e0b" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="14" fill="url(#sunGrad)" class="sun-body" />
      <g stroke="#f59e0b" stroke-width="3" stroke-linecap="round" class="sun-rays">
        <line x1="32" y1="6" x2="32" y2="12" />
        <line x1="32" y1="52" x2="32" y2="58" />
        <line x1="6" y1="32" x2="12" y2="32" />
        <line x1="52" y1="32" x2="58" y2="32" />
        <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" />
        <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" />
        <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" />
        <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" />
      </g>
    </svg>

    <!-- Clear Night / Moon -->
    <svg v-else-if="iconName === 'clear' || iconName === 'mostly-clear' && !isDay" viewBox="0 0 64 64" class="svg-weather svg-moon">
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="100%" stop-color="#eab308" />
        </linearGradient>
      </defs>
      <path d="M42 16A18 18 0 1 1 20 50 20 20 0 0 0 42 16Z" fill="url(#moonGrad)" class="moon-body" />
      <!-- Small twinkle stars -->
      <circle cx="48" cy="18" r="1.5" fill="#fef9c3" class="star star-1" />
      <circle cx="52" cy="30" r="1" fill="#fef9c3" class="star star-2" />
      <circle cx="16" cy="22" r="1.5" fill="#fef9c3" class="star star-3" />
    </svg>

    <!-- Partly Cloudy / Sun + Cloud -->
    <svg v-else-if="iconName === 'mostly-clear' || iconName === 'partly-cloudy'" viewBox="0 0 64 64" class="svg-weather">
      <!-- Sun in background -->
      <g v-if="isDay" class="sun-behind">
        <circle cx="24" cy="22" r="10" fill="#f59e0b" />
        <g stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round">
          <line x1="24" y1="6" x2="24" y2="9" />
          <line x1="10" y1="22" x2="13" y2="22" />
          <line x1="14" y1="12" x2="16.5" y2="14.5" />
          <line x1="34" y1="12" x2="31.5" y2="14.5" />
        </g>
      </g>
      <!-- Moon behind if night -->
      <path v-else d="M28 14A10 10 0 1 1 16 32 12 12 0 0 0 28 14Z" fill="#fde047" opacity="0.9" />
      <!-- Cloud foreground -->
      <path d="M46 46H20a10 10 0 0 1-1.6-19.86A13 13 0 0 1 43.6 24.5 9 9 0 0 1 46 46z"
            fill="url(#cloudGrad)" filter="url(#dropShadow)" class="cloud-float" />
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.15" />
        </filter>
      </defs>
    </svg>

    <!-- Overcast / Clouds -->
    <svg v-else-if="iconName === 'overcast'" viewBox="0 0 64 64" class="svg-weather">
      <!-- Back cloud -->
      <path d="M42 34H26a7 7 0 0 1-1.1-13.9A9 9 0 0 1 40.3 19 6.5 6.5 0 0 1 42 34z"
            fill="#94a3b8" opacity="0.75" transform="translate(6, -4)" />
      <!-- Front cloud -->
      <path d="M48 48H18a11 11 0 0 1-1.8-21.8A14 14 0 0 1 45.4 24.3 10 10 0 0 1 48 48z"
            fill="url(#overcastGrad)" class="cloud-float" />
      <defs>
        <linearGradient id="overcastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#94a3b8" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Rain / Showers -->
    <svg v-else-if="iconName === 'rain' || iconName === 'drizzle'" viewBox="0 0 64 64" class="svg-weather">
      <path d="M48 38H18a10 10 0 0 1-1.6-19.86A13 13 0 0 1 45.6 16.5 9 9 0 0 1 48 38z" fill="url(#rainCloud)" />
      <!-- Raindrops -->
      <g stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" class="raindrops">
        <line x1="22" y1="44" x2="19" y2="52" class="drop drop-1" />
        <line x1="32" y1="44" x2="29" y2="54" class="drop drop-2" />
        <line x1="42" y1="44" x2="39" y2="52" class="drop drop-3" />
      </g>
      <defs>
        <linearGradient id="rainCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e2e8f0" />
          <stop offset="100%" stop-color="#64748b" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Heavy Rain -->
    <svg v-else-if="iconName === 'heavy-rain'" viewBox="0 0 64 64" class="svg-weather">
      <path d="M48 36H18a10 10 0 0 1-1.6-19.86A13 13 0 0 1 45.6 14.5 9 9 0 0 1 48 36z" fill="#475569" />
      <g stroke="#0284c7" stroke-width="2.8" stroke-linecap="round" class="raindrops-heavy">
        <line x1="20" y1="42" x2="16" y2="54" class="drop drop-1" />
        <line x1="28" y1="42" x2="24" y2="56" class="drop drop-2" />
        <line x1="36" y1="42" x2="32" y2="54" class="drop drop-3" />
        <line x1="44" y1="42" x2="40" y2="56" class="drop drop-1" />
      </g>
    </svg>

    <!-- Thunderstorm / Lightning -->
    <svg v-else-if="iconName.includes('thunderstorm')" viewBox="0 0 64 64" class="svg-weather">
      <path d="M48 34H18a10 10 0 0 1-1.6-19.86A13 13 0 0 1 45.6 12.5 9 9 0 0 1 48 34z" fill="#334155" />
      <!-- Lightning bolt -->
      <polygon points="32,34 23,46 31,46 27,58 41,43 33,43" fill="#facc15" class="lightning" />
    </svg>

    <!-- Snow -->
    <svg v-else-if="iconName.includes('snow')" viewBox="0 0 64 64" class="svg-weather">
      <path d="M48 36H18a10 10 0 0 1-1.6-19.86A13 13 0 0 1 45.6 14.5 9 9 0 0 1 48 36z" fill="#94a3b8" />
      <g fill="#e0f2fe" class="snowflakes">
        <circle cx="22" cy="46" r="2.5" class="flake flake-1" />
        <circle cx="33" cy="50" r="3" class="flake flake-2" />
        <circle cx="44" cy="46" r="2.5" class="flake flake-3" />
        <circle cx="28" cy="56" r="2" class="flake flake-4" />
        <circle cx="39" cy="56" r="2" class="flake flake-5" />
      </g>
    </svg>

    <!-- Fog -->
    <svg v-else-if="iconName === 'fog'" viewBox="0 0 64 64" class="svg-weather">
      <g stroke="#94a3b8" stroke-width="3" stroke-linecap="round" class="fog-lines">
        <line x1="16" y1="20" x2="48" y2="20" opacity="0.6" />
        <line x1="12" y1="28" x2="52" y2="28" opacity="0.9" />
        <line x1="14" y1="36" x2="50" y2="36" opacity="0.8" />
        <line x1="18" y1="44" x2="46" y2="44" opacity="0.6" />
      </g>
    </svg>

    <!-- Sleet / Freezing Rain fallback -->
    <svg v-else viewBox="0 0 64 64" class="svg-weather">
      <path d="M48 36H18a10 10 0 0 1-1.6-19.86A13 13 0 0 1 45.6 14.5 9 9 0 0 1 48 36z" fill="#94a3b8" />
      <circle cx="24" cy="48" r="2" fill="#38bdf8" />
      <line x1="36" y1="44" x2="33" y2="52" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: 'clear'
  },
  isDay: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg', 'xl', 'hero'
  },
  customClass: {
    type: String,
    default: ''
  }
});

const iconName = computed(() => props.icon || 'clear');

const sizeClass = computed(() => {
  return `size-${props.size}`;
});
</script>

<style scoped>
.weather-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;
}

.svg-weather {
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12));
}

/* Sizing Tokens */
.size-sm { width: 28px; height: 28px; }
.size-md { width: 44px; height: 44px; }
.size-lg { width: 68px; height: 68px; }
.size-xl { width: 96px; height: 96px; }
.size-hero { width: 140px; height: 140px; }

/* Micro animations */
.sun-rays {
  transform-origin: 32px 32px;
  animation: spinRays 24s linear infinite;
}

.sun-body {
  animation: pulseSun 4s ease-in-out infinite alternate;
}

@keyframes spinRays {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulseSun {
  0% { transform: scale(0.96); transform-origin: 32px 32px; }
  100% { transform: scale(1.04); transform-origin: 32px 32px; }
}

.cloud-float {
  animation: floatCloud 5s ease-in-out infinite alternate;
}

@keyframes floatCloud {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-3px); }
}

.moon-body {
  animation: moonTilt 6s ease-in-out infinite alternate;
  transform-origin: 32px 32px;
}

@keyframes moonTilt {
  0% { transform: rotate(-3deg); }
  100% { transform: rotate(3deg); }
}

.star-1 { animation: twinkle 2s infinite ease-in-out; }
.star-2 { animation: twinkle 3s infinite ease-in-out 0.8s; }
.star-3 { animation: twinkle 2.5s infinite ease-in-out 1.5s; }

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.3); }
}

/* Raindrop falling animation */
.drop {
  animation: rainDrop 1.2s cubic-bezier(0.5, 0, 0.75, 0) infinite;
}
.drop-1 { animation-delay: 0s; }
.drop-2 { animation-delay: 0.35s; }
.drop-3 { animation-delay: 0.7s; }

@keyframes rainDrop {
  0% { opacity: 0; transform: translateY(-4px); }
  30% { opacity: 1; }
  100% { opacity: 0; transform: translateY(10px); }
}

/* Lightning flicker */
.lightning {
  animation: lightningBolt 3.5s infinite;
  transform-origin: 32px 34px;
}

@keyframes lightningBolt {
  0%, 88%, 94%, 100% { opacity: 0; }
  89%, 93% { opacity: 1; transform: scale(1.08); filter: drop-shadow(0 0 10px #facc15); }
  90% { opacity: 0.2; }
  92% { opacity: 1; }
}

/* Flakes */
.flake {
  animation: snowFlake 3s linear infinite;
}
.flake-1 { animation-delay: 0s; }
.flake-2 { animation-delay: 0.8s; }
.flake-3 { animation-delay: 1.5s; }
.flake-4 { animation-delay: 2.1s; }
.flake-5 { animation-delay: 0.4s; }

@keyframes snowFlake {
  0% { opacity: 0; transform: translateY(-4px) translateX(0); }
  30% { opacity: 1; }
  100% { opacity: 0; transform: translateY(12px) translateX(2px); }
}
</style>
