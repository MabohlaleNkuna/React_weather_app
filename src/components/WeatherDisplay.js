import React from 'react';
import ForecastItem from './ForecastItem';

const WeatherDisplay = ({ degree, humidity, windSpeed, main, forecast, img, viewType, unit }) => {
  const displayForecast = (forecast) => {
    if (viewType === 'daily') {
    
      const dailyForecasts = forecast.filter((item, index) => index % 8 === 0);
      return dailyForecasts.map((item, index) => (
        <ForecastItem
          key={index}
          hour={item.hour}
          temp={item.temp}
          description={item.description}
          img={item.img}
        />
      ));
    }
    // Hourly view
    return forecast.map((item, index) => (
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
      <img src={img} alt={main} />
      <div className="current-conditions">
        <div className="degree">{degree}°{unit === 'metric' ? 'C' : 'F'}</div>
        <div className="humidity">Humidity: {humidity}%</div>
        <div className="wind-speed">Wind Speed: {windSpeed} {unit === 'metric' ? 'm/s' : 'mph'}</div>
      </div>
      <div className="description">{main}</div>
      <div className="forecast">
        {displayForecast(forecast)}
      </div>
    </div>
  );
};

export default WeatherDisplay;
