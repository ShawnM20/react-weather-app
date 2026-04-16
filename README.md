<img width="1906" height="879" alt="image" src="https://github.com/user-attachments/assets/430f2981-b719-467c-bd02-fcf324e1190b" />
Weather Atlas

A responsive React weather app built with Vite and TypeScript. It lets you search for a city, view current conditions, and scan a seven-day forecast in a clean dashboard layout.

Features
Search for weather by city name
Automatic local weather on first load when location access is allowed
Current conditions with temperature, feels-like temperature, humidity, and wind
Seven-day forecast with highs, lows, and rain chance
Fahrenheit and Celsius toggle
Responsive layout for desktop and mobile
Tech Stack
React
TypeScript
Vite
Open-Meteo APIs
Tailwind CSS utilities with custom CSS styling
Getting Started
1. Install dependencies
Open a terminal in the project folder:

cd C:\Users\shawn\Documents\react-weather-app
npm.cmd install
2. Start the development server
npm.cmd run dev
Then open the local URL shown in the terminal, usually:

http://localhost:5173

Available Scripts
Run the app locally
npm.cmd run dev
Starts the Vite development server.

Build for production
npm.cmd run build
Creates an optimized production build in dist/.

Preview the production build
npm.cmd run preview
Runs a local preview of the built app.

Lint the project
npm.cmd run lint
Checks the codebase with ESLint.

How To Use
View local weather
When the app opens, allow browser location access if you want to see weather for your current location automatically.

Search for a city
Use the search bar to look up any city by name, such as Boston, Tokyo, or Nairobi.

Change temperature units
Use the unit toggle to switch between Fahrenheit and Celsius.

Read the forecast
The main panel shows current conditions.
The forecast panel shows the next seven days with daily highs, lows, and precipitation chance.
Data Source
This app uses free weather and geocoding data from:

Open-Meteo Forecast API
Open-Meteo Geocoding API
Project Structure
src/
  App.tsx
  App.css
  index.css
  components/
    CurrentWeather.tsx
    SearchBar.tsx
  types/
    weather.ts
Notes
Internet access is required for weather data to load.
If location access is denied, you can still search for any city manually.
The app currently uses the first matching city returned by the geocoding search.
Future Ideas
Hourly forecast
Saved recent searches
Weather icons or animated backgrounds
Better handling for multiple city matches
