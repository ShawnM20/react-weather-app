export type WeatherUnit = 'c' | 'f'

export interface LocationLabel {
  city: string
  region: string
  country: string
}

export interface CurrentWeather {
  temperature: number
  apparentTemperature: number
  relativeHumidity: number
  windSpeed: number
  weatherCode: number
  time: string
}

export interface DailyForecastDay {
  date: string
  high: number
  low: number
  weatherCode: number
  precipitationChance: number
}

export interface WeatherData {
  current: CurrentWeather
  daily: DailyForecastDay[]
}
