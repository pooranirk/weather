<template>
  <div class="search-container">
    <div class="search-bar-wrap">
      <div class="input-group">
        <!-- Search icon -->
        <span class="search-prefix-icon">
          <svg viewBox="0 0 24 24" class="svg-icon" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          ref="inputRef"
          type="text"
          v-model="query"
          class="search-input"
          placeholder="Search city or location (e.g., Chennai, London, Tokyo)..."
          @input="handleInput"
          @keydown.down.prevent="navigateSuggestions(1)"
          @keydown.up.prevent="navigateSuggestions(-1)"
          @keydown.enter.prevent="selectHighlightedOrFirst"
          @keydown.esc="closeSuggestions"
          @focus="openIfHasResults"
        />

        <!-- Loading spinner inside input -->
        <div v-if="searching" class="input-spinner" title="Searching via Fetch API">
          <div class="mini-loader"></div>
        </div>

        <!-- Clear text button -->
        <button 
          v-if="query && !searching" 
          type="button" 
          class="clear-btn" 
          @click="clearSearch"
          title="Clear search"
        >
          ✕
        </button>

        <!-- Current Location Button -->
        <button
          type="button"
          class="geo-btn"
          :class="{ 'is-locating': locating }"
          @click="handleGeoLocation"
          title="Use current GPS location"
          :disabled="locating"
        >
          <svg viewBox="0 0 24 24" class="geo-svg" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          <span class="geo-text">My Location</span>
        </button>
      </div>

      <!-- Autocomplete Dropdown -->
      <transition name="dropdown-fade">
        <ul v-if="showSuggestions && suggestions.length > 0" class="suggestions-dropdown glass-card">
          <li
            v-for="(item, index) in suggestions"
            :key="item.id"
            class="suggestion-item"
            :class="{ 'is-highlighted': selectedIndex === index }"
            @mouseenter="selectedIndex = index"
            @click="selectCity(item)"
          >
            <div class="item-icon">
              <svg viewBox="0 0 24 24" class="item-pin" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-sub">
                {{ [item.admin1, item.country].filter(Boolean).join(', ') }}
              </span>
            </div>
            <span class="item-coords">
              {{ item.latitude.toFixed(2) }}°, {{ item.longitude.toFixed(2) }}°
            </span>
          </li>
        </ul>
      </transition>
    </div>

    <!-- Quick pills / Popular Cities -->
    <div class="quick-chips-wrapper">
      <span class="quick-chips-label">Popular:</span>
      <div class="chips-list">
        <button
          v-for="city in popularCities"
          :key="city.name"
          type="button"
          class="chip-pill"
          :class="{ active: currentCityName === city.name }"
          @click="selectPredefinedCity(city)"
        >
          <span class="chip-flag">{{ city.flag }}</span>
          <span>{{ city.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { searchCities } from '../services/weatherService';

const props = defineProps({
  currentCityName: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['select-city', 'use-geolocation', 'notify-error']);

const query = ref('');
const suggestions = ref([]);
const searching = ref(false);
const locating = ref(false);
const showSuggestions = ref(false);
const selectedIndex = ref(-1);
const inputRef = ref(null);

let debounceTimer = null;

const popularCities = [
  { name: 'Chennai', country: 'India', flag: '🇮🇳', lat: 13.0827, lon: 80.2707 },
  { name: 'Mumbai', country: 'India', flag: '🇮🇳', lat: 19.076, lon: 72.8777 },
  { name: 'Delhi', country: 'India', flag: '🇮🇳', lat: 28.6139, lon: 77.209 },
  { name: 'Bengaluru', country: 'India', flag: '🇮🇳', lat: 12.9716, lon: 77.5946 },
  { name: 'London', country: 'United Kingdom', flag: '🇬🇧', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', country: 'USA', flag: '🇺🇸', lat: 40.7128, lon: -74.006 },
  { name: 'Dubai', country: 'UAE', flag: '🇦🇪', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', country: 'Singapore', flag: '🇸🇬', lat: 1.3521, lon: 103.8198 },
  { name: 'Paris', country: 'France', flag: '🇫🇷', lat: 48.8566, lon: 2.3522 }
];

function handleInput() {
  if (debounceTimer) clearTimeout(debounceTimer);
  selectedIndex.value = -1;

  if (query.value.trim().length < 2) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }

  debounceTimer = setTimeout(async () => {
    searching.value = true;
    try {
      // Native fetch API call inside searchCities
      const results = await searchCities(query.value);
      suggestions.value = results;
      showSuggestions.value = results.length > 0;
    } catch (err) {
      console.error('Fetch search error:', err);
    } finally {
      searching.value = false;
    }
  }, 300);
}

function openIfHasResults() {
  if (suggestions.value.length > 0) {
    showSuggestions.value = true;
  }
}

function closeSuggestions() {
  showSuggestions.value = false;
  selectedIndex.value = -1;
}

function clearSearch() {
  query.value = '';
  suggestions.value = [];
  showSuggestions.value = false;
  selectedIndex.value = -1;
  if (inputRef.value) inputRef.value.focus();
}

function navigateSuggestions(step) {
  if (!showSuggestions.value || suggestions.value.length === 0) return;
  const count = suggestions.value.length;
  selectedIndex.value = (selectedIndex.value + step + count) % count;
}

function selectHighlightedOrFirst() {
  if (suggestions.value.length === 0) {
    // If user hit enter directly on custom query without waiting for suggestions
    if (query.value.trim().length >= 2) {
      searchCities(query.value.trim()).then((res) => {
        if (res && res.length > 0) selectCity(res[0]);
      });
    }
    return;
  }
  const item = selectedIndex.value >= 0 ? suggestions.value[selectedIndex.value] : suggestions.value[0];
  selectCity(item);
}

function selectCity(item) {
  emit('select-city', {
    name: item.name,
    country: item.country,
    admin1: item.admin1,
    lat: item.latitude,
    lon: item.longitude
  });
  query.value = `${item.name}, ${item.country || ''}`.replace(/,\s*$/, '');
  closeSuggestions();
}

function selectPredefinedCity(city) {
  emit('select-city', {
    name: city.name,
    country: city.country,
    lat: city.lat,
    lon: city.lon
  });
}

function handleGeoLocation() {
  if (!navigator.geolocation) {
    emit('notify-error', 'Geolocation is not supported by your browser.');
    return;
  }

  locating.value = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      locating.value = false;
      emit('use-geolocation', {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      });
    },
    (err) => {
      locating.value = false;
      let msg = 'Could not retrieve your location.';
      if (err.code === 1) msg = 'Location permission denied by user.';
      else if (err.code === 2) msg = 'Location unavailable. Please search manually.';
      emit('notify-error', msg);
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

function handleClickOutside(e) {
  if (!e.target.closest('.search-bar-wrap')) {
    closeSuggestions();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (debounceTimer) clearTimeout(debounceTimer);
});
</script>

<style scoped>
.search-container {
  margin-bottom: 24px;
  position: relative;
  z-index: 15;
}

.search-bar-wrap {
  position: relative;
  max-width: 820px;
  margin: 0 auto;
}

.input-group {
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 18px;
  padding: 6px 10px 6px 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
}

.input-group:focus-within {
  border-color: #38bdf8;
  box-shadow: 0 10px 35px rgba(56, 189, 248, 0.25);
  background: rgba(15, 23, 42, 0.85);
}

.search-prefix-icon {
  display: flex;
  align-items: center;
  color: #94a3b8;
  margin-right: 12px;
}

.svg-icon {
  width: 20px;
  height: 20px;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-family: inherit;
  font-size: 16px;
  outline: none;
  min-width: 0;
}

.search-input::placeholder {
  color: #64748b;
  font-size: 15px;
}

.input-spinner {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.mini-loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(56, 189, 248, 0.2);
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.clear-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #ffffff;
}

.geo-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(99, 102, 241, 0.2));
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #38bdf8;
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.geo-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(99, 102, 241, 0.35));
  border-color: #38bdf8;
  color: #ffffff;
  transform: translateY(-1px);
}

.geo-svg {
  width: 15px;
  height: 15px;
}

.geo-btn.is-locating .geo-svg {
  animation: pulseLocate 1s infinite alternate;
}

@keyframes pulseLocate {
  0% { transform: scale(0.9); }
  100% { transform: scale(1.2); }
}

/* Autocomplete Dropdown */
.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  border-radius: 16px;
  max-height: 290px;
  overflow-y: auto;
  list-style: none;
  padding: 6px;
  margin: 0;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.suggestion-item:hover,
.suggestion-item.is-highlighted {
  background: rgba(56, 189, 248, 0.15);
}

.item-icon {
  color: #38bdf8;
  display: flex;
}

.item-pin {
  width: 18px;
  height: 18px;
}

.item-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  color: #f8fafc;
}

.item-sub {
  font-size: 12px;
  color: #94a3b8;
}

.item-coords {
  font-size: 11px;
  color: #64748b;
  font-family: monospace;
}

/* Quick chips */
.quick-chips-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-chips-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chips-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.chip-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip-pill:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.chip-pill.active {
  background: rgba(56, 189, 248, 0.2);
  border-color: #38bdf8;
  color: #38bdf8;
}

.chip-flag {
  font-size: 14px;
}

/* Transitions */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 640px) {
  .geo-text {
    display: none;
  }
  .geo-btn {
    padding: 8px;
  }
}
</style>
