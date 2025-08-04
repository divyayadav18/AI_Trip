import React, { useState } from "react";
import './Weather.css';
import { WiThermometer, WiHumidity, WiStrongWind, WiDaySunny } from "react-icons/wi";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; 

const WeatherWidget = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();
      if (!geoData || geoData.length === 0) {
        setError("City not found. Please enter a valid location.");
        setLoading(false);
        return;
      }
      const { lat, lon, country } = geoData[0];
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const weatherData = await weatherResponse.json();
      if (!weatherData || !weatherData.list) {
        setError("Weather data not available.");
        setLoading(false);
        return;
      }
      setWeather({
        temp: weatherData.list[0].main.temp,
        description: weatherData.list[0].weather[0].description,
        icon: `https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}.png`,
        humidity: weatherData.list[0].main.humidity,
        wind: weatherData.list[0].wind.speed,
        country,
      });
      const dailyForecast = weatherData.list.filter((entry) =>
        entry.dt_txt.includes("12:00:00")
      ).slice(0, 5);
      setForecast(dailyForecast);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Failed to fetch weather data.");
    }
    setLoading(false);
  };
  return (
    <div className="weather-container">
      <h2 className="weather-heading">🌍 Discover Your Destination's Weather</h2>
      <p className="weather-quote">"Adventure is out there, but it's always best to check the weather first!"</p>
      <div className="weather-input">
        <input
          type="text"
          placeholder="Enter City "
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather} disabled={loading}>
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="weather-boxes">
        {/* Left Box: Current Weather */}
        {weather && (
          <div className="weather-box current-weather">
            <h3>{city}, {weather.country}</h3>
            <img src={weather.icon} alt="Weather Icon" className="weather-icon" />
            <p className="temp">{weather.temp}°C</p>
            <p className="desc">{weather.description}</p>
            <div className="weather-details">
              <p><WiHumidity size={25} /> {weather.humidity}% Humidity</p>
              <p><WiStrongWind size={25} /> {weather.wind} m/s Wind</p>
            </div>
          </div>
        )}

        {/* Right Box: 5-Day Forecast */}
        {forecast.length > 0 && (
          <div className="weather-box forecast-box">
            <h3>📅 5-Day Forecast</h3>
            <div className="forecast-container">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>{new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })}</p>
                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="Weather Icon" />
                  <p className="temp">{day.main.temp}°C</p>
                  <p className="desc">{day.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
