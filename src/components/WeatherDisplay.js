import React from 'react';
import ForecastItem from './ForecastItem';

const WeatherDisplay = ({ degree, humidity, windSpeed, main, forecast, img, viewType, unit }) => {

  const getCurrentDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString(undefined, options);
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const displayForecast = (forecast) => {
    if (viewType === 'daily') {
      const today = new Date();
      const dailyForecasts = forecast.slice(0, 7).map((item, index) => {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + index);
        const dayName = days[forecastDate.getDay()];

        return {
          ...item,
          day: dayName
        };
      });

      return dailyForecasts.map((item, index) => (
        <ForecastItem
          key={index}
          day={item.day}
          temp={item.temp}
          description={item.description}
          img={item.img}
        />
      ));
    }
    
    const hourlyForecasts = forecast.slice(0, 12);
    return hourlyForecasts.map((item, index) => (
      <ForecastItem
        key={index}
        hour={item.hour}
        temp={item.temp}
        description={item.description}
        img={item.img}
      />
    ));
  };

  return (
    <div className="weather-display">
      <h2>{main}</h2>
      <div className="degree-image-container">
        <img src={img} alt={main} className="weather-icon" />
        <div className="degree">
          {degree}°{unit === 'metric' ? 'C' : 'F'}
        </div>
      </div>
      <div className="current-conditions">
        <div className="humidity">Humidity: {humidity}%</div>
        <div className="wind-speed">Wind Speed: {windSpeed} {unit === 'metric' ? 'm/s' : 'mph'}</div>
      </div>
      <div className="date">{getCurrentDate()}</div>
      <div className="forecast">
        {displayForecast(forecast)}
      </div>
    </div>
  );
};

export default WeatherDisplay;
