/**
 * Weather Service using standard Browser Fetch API (Zero Axios dependency)
 * Connects to Open-Meteo Geocoding & Weather APIs (No API key required)
 */

// WMO Weather Interpretation Codes (WW) mapping
export const WEATHER_CODES = {
  0: { label: 'Clear Sky', icon: 'clear', description: 'Sunny and completely clear sky' },
  1: { label: 'Mainly Clear', icon: 'mostly-clear', description: 'Mainly clear with sparse clouds' },
  2: { label: 'Partly Cloudy', icon: 'partly-cloudy', description: 'Scattered clouds with sun intervals' },
  3: { label: 'Overcast', icon: 'overcast', description: 'Dense overcast cloud cover' },
  45: { label: 'Foggy', icon: 'fog', description: 'Fog with reduced visibility' },
  48: { label: 'Depositing Rime Fog', icon: 'fog', description: 'Freezing rime fog' },
  51: { label: 'Light Drizzle', icon: 'drizzle', description: 'Light patchy drizzle' },
  53: { label: 'Moderate Drizzle', icon: 'drizzle', description: 'Moderate continuous drizzle' },
  55: { label: 'Dense Drizzle', icon: 'drizzle', description: 'Heavy dense drizzle' },
  56: { label: 'Freezing Drizzle', icon: 'sleet', description: 'Light freezing drizzle' },
  57: { label: 'Dense Freezing Drizzle', icon: 'sleet', description: 'Heavy freezing drizzle' },
  61: { label: 'Slight Rain', icon: 'rain', description: 'Light intermittent rain' },
  63: { label: 'Moderate Rain', icon: 'rain', description: 'Moderate steady rain' },
  65: { label: 'Heavy Rain', icon: 'heavy-rain', description: 'Heavy torrential rainfall' },
  66: { label: 'Freezing Rain', icon: 'sleet', description: 'Light freezing rain' },
  67: { label: 'Heavy Freezing Rain', icon: 'sleet', description: 'Heavy freezing rain' },
  71: { label: 'Slight Snow Fall', icon: 'snow', description: 'Light gentle snow showers' },
  73: { label: 'Moderate Snow Fall', icon: 'snow', description: 'Moderate continuous snowfall' },
  75: { label: 'Heavy Snow Fall', icon: 'heavy-snow', description: 'Heavy blizzard conditions' },
  77: { label: 'Snow Grains', icon: 'snow', description: 'Fine snow grains' },
  80: { label: 'Slight Rain Showers', icon: 'rain', description: 'Brief passing rain showers' },
  81: { label: 'Moderate Rain Showers', icon: 'rain', description: 'Moderate rain showers' },
  82: { label: 'Violent Rain Showers', icon: 'heavy-rain', description: 'Violent downpour showers' },
  85: { label: 'Slight Snow Showers', icon: 'snow', description: 'Light snow flurries' },
  86: { label: 'Heavy Snow Showers', icon: 'heavy-snow', description: 'Heavy snow showers' },
  95: { label: 'Thunderstorm', icon: 'thunderstorm', description: 'Thunderstorm with lightning' },
  96: { label: 'Thunderstorm with Hail', icon: 'thunderstorm-hail', description: 'Thunderstorm with light hail' },
  99: { label: 'Severe Thunderstorm', icon: 'thunderstorm-hail', description: 'Severe thunderstorm with heavy hail' },
};

/**
 * Maps WMO code & day/night status to a visual theme key
 */
export function getThemeKey(code, isDay = 1) {
  if ([95, 96, 99].includes(code)) return 'thunderstorm';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([45, 48].includes(code)) return 'fog';
  if ([2, 3].includes(code)) return isDay ? 'cloudy-day' : 'cloudy-night';
  return isDay ? 'clear-day' : 'clear-night';
}

/**
 * Returns weather metadata for a code
 */
export function getWeatherInfo(code, isDay = 1) {
  const base = WEATHER_CODES[code] || {
    label: 'Unknown',
    icon: 'partly-cloudy',
    description: 'Variable weather conditions'
  };

  const theme = getThemeKey(code, isDay);
  return {
    ...base,
    theme,
    isDay: Boolean(isDay),
    displayLabel: (code === 0 || code === 1) ? (isDay ? 'Sunny' : 'Clear Night') : base.label
  };
}

/**
 * Search cities using Open-Meteo Geocoding API with native fetch()
 * @param {string} query 
 * @returns {Promise<Array>}
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.results) return [];

    return data.results.map((item) => ({
      id: item.id,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto'
    }));
  } catch (err) {
    console.error('Error fetching city suggestions:', err);
    throw err;
  }
}

/**
 * Fetch detailed weather forecast using Open-Meteo API with native fetch()
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>}
 */
export async function getWeatherData(latitude, longitude) {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'weather_code',
    'wind_speed_10m',
    'wind_direction_10m',
    'surface_pressure'
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'weather_code',
    'precipitation_probability',
    'relative_humidity_2m'
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'precipitation_probability_max'
  ].join(',');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=auto`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();
    return processWeatherData(rawData);
  } catch (error) {
    console.error('Fetch weather data failed:', error);
    throw error;
  }
}

/**
 * Reverse geocode coordinates to City Name using free BigDataCloud API with native fetch()
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>}
 */
export async function reverseGeocode(latitude, longitude) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`);
    }
    const data = await response.json();
    return {
      name: data.city || data.locality || data.principalSubdivision || 'Current Location',
      country: data.countryName || '',
      countryCode: data.countryCode || '',
      admin1: data.principalSubdivision || ''
    };
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
    return {
      name: 'Detected Location',
      country: '',
      countryCode: '',
      admin1: ''
    };
  }
}

/**
 * Format and process raw forecast JSON into clean UI-ready structures
 */
function processWeatherData(data) {
  const current = data.current;
  const currentUnits = data.current_units;
  const condition = getWeatherInfo(current.weather_code, current.is_day);

  // Hourly forecast - take next 24 hours from current index
  const hourly = [];
  if (data.hourly && data.hourly.time) {
    const nowIso = current.time;
    let startIndex = data.hourly.time.findIndex((t) => t >= nowIso);
    if (startIndex === -1) startIndex = 0;

    for (let i = startIndex; i < Math.min(startIndex + 24, data.hourly.time.length); i++) {
      const timeStr = data.hourly.time[i];
      const hourDate = new Date(timeStr);
      const isDayHour = hourDate.getHours() >= 6 && hourDate.getHours() < 19 ? 1 : 0;
      const code = data.hourly.weather_code[i];

      hourly.push({
        time: timeStr,
        displayTime: hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hourNum: hourDate.getHours(),
        temperature: Math.round(data.hourly.temperature_2m[i]),
        condition: getWeatherInfo(code, isDayHour),
        precipitationProb: data.hourly.precipitation_probability ? data.hourly.precipitation_probability[i] : 0,
        humidity: data.hourly.relative_humidity_2m ? data.hourly.relative_humidity_2m[i] : null
      });
    }
  }

  // Daily forecast - 7 days
  const daily = [];
  if (data.daily && data.daily.time) {
    for (let i = 0; i < data.daily.time.length; i++) {
      const dateStr = data.daily.time[i];
      const d = new Date(dateStr);
      const isToday = i === 0;

      daily.push({
        date: dateStr,
        dayName: isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weatherCode: data.daily.weather_code[i],
        condition: getWeatherInfo(data.daily.weather_code[i], 1),
        maxTemp: Math.round(data.daily.temperature_2m_max[i]),
        minTemp: Math.round(data.daily.temperature_2m_min[i]),
        sunrise: data.daily.sunrise ? data.daily.sunrise[i] : null,
        sunset: data.daily.sunset ? data.daily.sunset[i] : null,
        uvIndex: data.daily.uv_index_max ? data.daily.uv_index_max[i] : 0,
        precipProb: data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[i] : 0,
        precipSum: data.daily.precipitation_sum ? data.daily.precipitation_sum[i] : 0
      });
    }
  }

  // Today's summary values
  const todayDaily = daily[0] || {};

  return {
    raw: data,
    current: {
      time: current.time,
      tempC: Math.round(current.temperature_2m * 10) / 10,
      feelsLikeC: Math.round(current.apparent_temperature * 10) / 10,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      windDirection: current.wind_direction_10m,
      windDirectionLabel: getWindDirectionLabel(current.wind_direction_10m),
      pressure: Math.round(current.surface_pressure),
      precipitation: current.precipitation,
      isDay: Boolean(current.is_day),
      weatherCode: current.weather_code,
      condition,
      maxTempC: todayDaily.maxTemp || Math.round(current.temperature_2m),
      minTempC: todayDaily.minTemp || Math.round(current.temperature_2m),
      uvIndex: todayDaily.uvIndex || 0,
      uvRisk: getUVRisk(todayDaily.uvIndex || 0),
      sunrise: todayDaily.sunrise || '',
      sunset: todayDaily.sunset || '',
      displaySunrise: formatTime(todayDaily.sunrise),
      displaySunset: formatTime(todayDaily.sunset)
    },
    hourly,
    daily
  };
}

/**
 * Format ISO datetime string to friendly 12h time (e.g. "6:15 AM")
 */
export function formatTime(isoStr) {
  if (!isoStr) return '--:--';
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return '--:--';
  }
}

/**
 * Convert Celsius to Fahrenheit
 */
export function cToF(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Get Compass Direction from degrees
 */
export function getWindDirectionLabel(degrees) {
  if (degrees === undefined || degrees === null) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Get UV Index risk description and color tone
 */
export function getUVRisk(uv) {
  if (uv < 3) return { label: 'Low', color: '#10b981', advice: 'No special protection needed' };
  if (uv < 6) return { label: 'Moderate', color: '#f59e0b', advice: 'Wear sunglasses & SPF 30+' };
  if (uv < 8) return { label: 'High', color: '#f97316', advice: 'Seek shade during midday hours' };
  if (uv < 11) return { label: 'Very High', color: '#ef4444', advice: 'Extra protection required' };
  return { label: 'Extreme', color: '#a855f7', advice: 'Avoid midday outdoor exposure' };
}
