import { useEffect, useState } from 'react'
import './App.css'
import CurrentWeather from './components/CurrentWeather'
import SearchBar from './components/SearchBar'
import type { LocationLabel, WeatherData, WeatherUnit } from './types/weather'

const weatherCodeMap: Record<number, { label: string; tone: string }> = {
  0: { label: 'Clear sky', tone: 'Bright' },
  1: { label: 'Mostly clear', tone: 'Bright' },
  2: { label: 'Partly cloudy', tone: 'Soft' },
  3: { label: 'Overcast', tone: 'Muted' },
  45: { label: 'Foggy', tone: 'Muted' },
  48: { label: 'Rime fog', tone: 'Muted' },
  51: { label: 'Light drizzle', tone: 'Soft' },
  53: { label: 'Drizzle', tone: 'Soft' },
  55: { label: 'Heavy drizzle', tone: 'Storm' },
  61: { label: 'Rain', tone: 'Storm' },
  63: { label: 'Steady rain', tone: 'Storm' },
  65: { label: 'Heavy rain', tone: 'Storm' },
  71: { label: 'Light snow', tone: 'Crisp' },
  73: { label: 'Snow', tone: 'Crisp' },
  75: { label: 'Heavy snow', tone: 'Crisp' },
  77: { label: 'Snow grains', tone: 'Crisp' },
  80: { label: 'Rain showers', tone: 'Storm' },
  81: { label: 'Strong showers', tone: 'Storm' },
  82: { label: 'Heavy showers', tone: 'Storm' },
  85: { label: 'Snow showers', tone: 'Crisp' },
  86: { label: 'Heavy snow showers', tone: 'Crisp' },
  95: { label: 'Thunderstorm', tone: 'Storm' },
  96: { label: 'Thunder and hail', tone: 'Storm' },
  99: { label: 'Severe thunderstorm', tone: 'Storm' },
}

const initialHint = 'Search for any city, or allow location access for local weather.'

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState<LocationLabel | null>(null)
  const [query, setQuery] = useState('')
  const [unit, setUnit] = useState<WeatherUnit>('f')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState(initialHint)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false)
      setStatus(initialHint)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        await fetchWeather({
          latitude: coords.latitude,
          longitude: coords.longitude,
          label: {
            city: 'Your location',
            region: '',
            country: '',
          },
        })
      },
      () => {
        setLoading(false)
        setStatus(initialHint)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  async function fetchWeather({
    latitude,
    longitude,
    label,
  }: {
    latitude: number
    longitude: number
    label: LocationLabel
  }) {
    setLoading(true)
    setError(null)
    setStatus(`Loading weather for ${formatLocation(label)}...`)

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto`
      )

      if (!response.ok) {
        throw new Error('Unable to load forecast right now.')
      }

      const data = await response.json()

      setWeather({
        current: {
          temperature: data.current.temperature_2m,
          apparentTemperature: data.current.apparent_temperature,
          relativeHumidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          weatherCode: data.current.weather_code,
          time: data.current.time,
        },
        daily: data.daily.time.map((day: string, index: number) => ({
          date: day,
          high: data.daily.temperature_2m_max[index],
          low: data.daily.temperature_2m_min[index],
          weatherCode: data.daily.weather_code[index],
          precipitationChance: data.daily.precipitation_probability_max[index] ?? 0,
        })),
      })
      setLocation(label)
      setStatus(`Updated ${formatLocation(label)}.`)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load forecast.')
      setStatus(initialHint)
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(city: string) {
    setQuery(city)
    setLoading(true)
    setError(null)
    setStatus(`Finding ${city}...`)

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      )

      if (!response.ok) {
        throw new Error('Unable to search for that city.')
      }

      const data = await response.json()
      const match = data.results?.[0]

      if (!match) {
        throw new Error('No matching city found. Try a broader search.')
      }

      await fetchWeather({
        latitude: match.latitude,
        longitude: match.longitude,
        label: {
          city: match.name,
          region: match.admin1 ?? '',
          country: match.country ?? '',
        },
      })
    } catch (caughtError) {
      setLoading(false)
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to search for that city.')
      setStatus(initialHint)
    }
  }

  const currentTone = weather ? getWeatherInfo(weather.current.weatherCode).tone.toLowerCase() : 'default'

  return (
    <main className={`app-shell tone-${currentTone}`}>
      <div className="app-backdrop" />

      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Weather Atlas</p>
          <h1>Plan your day with a cleaner forecast view.</h1>
          <p className="hero-text">
            Fast city search, current conditions, and a readable seven-day outlook without the clutter.
          </p>
        </div>

        <div className="hero-controls">
          <SearchBar onSearch={handleSearch} isLoading={loading} initialValue={query} />

          <div className="unit-toggle" aria-label="Temperature units">
            <button
              type="button"
              className={unit === 'f' ? 'active' : ''}
              onClick={() => setUnit('f')}
            >
              Fahrenheit
            </button>
            <button
              type="button"
              className={unit === 'c' ? 'active' : ''}
              onClick={() => setUnit('c')}
            >
              Celsius
            </button>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <div>
              <p className="label">Current forecast</p>
              <h2>{location ? formatLocation(location) : 'Waiting for a location'}</h2>
            </div>
            <p className="status-text">{loading ? 'Refreshing data...' : status}</p>
          </div>

          {error ? (
            <div className="message-card error-card">
              <strong>Something needs attention.</strong>
              <p>{error}</p>
            </div>
          ) : null}

          {loading && !weather ? (
            <div className="message-card">
              <div className="spinner" aria-hidden="true" />
              <p>Loading forecast details...</p>
            </div>
          ) : null}

          {weather ? (
            <CurrentWeather
              data={weather.current}
              unit={unit}
              location={location}
              getWeatherInfo={getWeatherInfo}
            />
          ) : null}
        </div>

        <aside className="panel panel-secondary">
          <div className="panel-heading">
            <div>
              <p className="label">Seven-day outlook</p>
              <h2>Forecast trend</h2>
            </div>
          </div>

          <div className="forecast-list">
            {weather?.daily.map((day) => {
              const info = getWeatherInfo(day.weatherCode)
              return (
                <article key={day.date} className="forecast-row">
                  <div>
                    <p className="forecast-day">{formatDay(day.date)}</p>
                    <p className="forecast-desc">{info.label}</p>
                  </div>

                  <div className="forecast-meta">
                    <span>{formatTemperature(day.high, unit)}</span>
                    <span>{formatTemperature(day.low, unit)}</span>
                    <span>{Math.round(day.precipitationChance)}% rain</span>
                  </div>
                </article>
              )
            })}

            {!loading && !weather ? (
              <div className="message-card">
                <p>Search for a city to load the forecast.</p>
              </div>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  )
}

function getWeatherInfo(code: number) {
  return weatherCodeMap[code] ?? { label: 'Variable conditions', tone: 'Soft' }
}

function formatLocation(location: LocationLabel) {
  return [location.city, location.region, location.country].filter(Boolean).join(', ')
}

function formatDay(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatTemperature(value: number, unit: WeatherUnit) {
  const converted = unit === 'c' ? value : value * (9 / 5) + 32
  return `${Math.round(converted)}${unit === 'c' ? 'C' : 'F'}`
}

export default App
