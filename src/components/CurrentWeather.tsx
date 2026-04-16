import type { CurrentWeather as CurrentWeatherData, LocationLabel, WeatherUnit } from '../types/weather'

interface CurrentWeatherProps {
  data: CurrentWeatherData
  unit: WeatherUnit
  location: LocationLabel | null
  getWeatherInfo: (code: number) => { label: string; tone: string }
}

export default function CurrentWeather({
  data,
  unit,
  location,
  getWeatherInfo,
}: CurrentWeatherProps) {
  const info = getWeatherInfo(data.weatherCode)

  return (
    <div className="current-weather-card">
      <div className="current-summary">
        <div>
          <p className="condition-tone">{info.tone}</p>
          <h3>{formatTemperature(data.temperature, unit)}</h3>
          <p className="condition-label">{info.label}</p>
          <p className="condition-time">
            Updated {formatTime(data.time)}
            {location ? ` for ${location.city}` : ''}
          </p>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-tile">
          <span>Feels like</span>
          <strong>{formatTemperature(data.apparentTemperature, unit)}</strong>
        </div>
        <div className="detail-tile">
          <span>Humidity</span>
          <strong>{Math.round(data.relativeHumidity)}%</strong>
        </div>
        <div className="detail-tile">
          <span>Wind</span>
          <strong>{formatWind(data.windSpeed, unit)}</strong>
        </div>
      </div>
    </div>
  )
}

function formatTemperature(value: number, unit: WeatherUnit) {
  const converted = unit === 'c' ? value : value * (9 / 5) + 32
  return `${Math.round(converted)}${unit === 'c' ? 'C' : 'F'}`
}

function formatWind(value: number, unit: WeatherUnit) {
  const converted = unit === 'c' ? value : value / 1.609
  return `${Math.round(converted)} ${unit === 'c' ? 'km/h' : 'mph'}`
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}
