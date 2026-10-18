# 🌤️ SkyCast Weather - Vue.js + Native Fetch API (No Axios)

A modern, real-time weather forecasting web application built with **Vue.js 3 (Composition API `<script setup>`)** and the browser's native **Fetch API**.

> **Note**: This project intentionally does **NOT** use Axios (`axios method use pnna vendam`). It demonstrates how to perform HTTP requests cleanly and efficiently using native `fetch()`.

---

## 🚀 How to Run the Project

1. Open your terminal in this project folder:
   ```bash
   cd "weather project"
   ```
2. Install dependencies (only required once):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit:
   ```
   http://localhost:5173/
   ```

---

## 💡 How Fetch API is used instead of Axios (Tamil / Tanglish Explanation)

### 1. Axios vs Fetch API Comparison:
| Feature | Axios (Avoided) | Native Fetch API (Used Here) |
|---|---|---|
| **Package Install** | `npm install axios` (extra dependency) | **None** (Built directly into modern browsers & Node.js) |
| **Response Parsing** | Automatic at `res.data` | Manual via `await res.json()` |
| **Error Handling** | Throws error automatically on 4xx / 5xx | Needs checking `if (!res.ok)` |
| **Bundle Size** | ~14KB added to bundle | **0 KB** (Zero external weight) |

### 2. Code Pattern used in Vue 3:

```javascript
// src/services/weatherService.js

export async function getWeatherData(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;

  try {
    // Step 1: Make HTTP request using native fetch()
    const response = await fetch(url);

    // Step 2: Check if response is successful (Status 200-299)
    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
    }

    // Step 3: Parse stream as JSON
    const data = await response.json();
    return data;
  } catch (error) {
    // Step 4: Handle network errors or server issues
    console.error('Fetch weather failed:', error);
    throw error;
  }
}
```

---

## ✨ Application Features

- **Zero API Key Requirement**: Uses free Open-Meteo REST endpoints (instantly works with no signup).
- **Search Autocomplete**: Real-time debounced location search using Open-Meteo Geocoding.
- **GPS Location Detection**: Single click to detect current position via browser Geolocation + reverse geocoding.
- **Popular City Quick Pills**: Chennai, Mumbai, Delhi, Bengaluru, London, Tokyo, New York, Dubai, Singapore, Paris.
- **Current Conditions**: Temperature, Feels Like, High/Low, Animated SVG weather icons.
- **Detailed Atmospheric Metrics**: Humidity gauge, Wind speed with compass heading, UV Index with health advice, Barometric pressure, Sunrise & Sunset astronomical cycle.
- **24-Hour Hourly Forecast**: Smooth horizontal scrollable cards with precipitation probability.
- **7-Day Extended Forecast**: Daily temperature range visual meters and conditions.
- **Unit Switcher**: Instant toggle between Celsius (°C) and Fahrenheit (°F).
- **Dynamic Weather Themes**: Glassmorphic UI with dynamic ambient lighting responding to weather (Sunny, Rain, Storm, Snow, Night, Clouds).
- **In-App Developer Guide Modal**: Interactive popup explaining Axios vs Fetch API with copyable snippets.

---

## 📂 Project Structure

```
weather project/
├── index.html                   # HTML entry point with fonts & metadata
├── src/
│   ├── main.js                  # Vue app initialization
│   ├── App.vue                  # Main application state & theme orchestrator
│   ├── style.css                # Glassmorphic design system & animations
│   ├── services/
│   │   └── weatherService.js    # Native Fetch API calls & data transforms
│   └── components/
│       ├── Navbar.vue           # Header with live clock, units toggle & guide trigger
│       ├── WeatherSearch.vue    # Search bar, debounce autocomplete & quick chips
│       ├── CurrentWeather.vue   # Main hero weather card
│       ├── WeatherIcon.vue      # Animated SVG weather illustrations
│       ├── WeatherMetrics.vue   # Wind, humidity, UV index & sun schedule
│       ├── HourlyForecast.vue   # 24h horizontal scroll forecast
│       ├── DailyForecast.vue    # 7-day extended forecast with visual range bars
│       └── FetchGuideModal.vue  # Educational developer guide modal
└── package.json
```
