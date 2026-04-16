import { useEffect, useState } from 'react'

interface SearchBarProps {
  onSearch: (city: string) => void
  isLoading: boolean
  initialValue?: string
}

export default function SearchBar({
  onSearch,
  isLoading,
  initialValue = '',
}: SearchBarProps) {
  const [city, setCity] = useState(initialValue)

  useEffect(() => {
    setCity(initialValue)
  }, [initialValue])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (city.trim()) {
      onSearch(city.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <label className="search-label" htmlFor="city-search">
        Search city
      </label>
      <div className="search-row">
        <input
          id="city-search"
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Try Boston, Nairobi, or Tokyo"
          autoComplete="off"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading' : 'Search'}
        </button>
      </div>
    </form>
  )
}
