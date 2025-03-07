import React from 'react'; 
import ForecastItem from './ForecastItem';
import { Card } from 'react-bootstrap'; // Importing Card from Bootstrap

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
  };

  return (
    <div className="weather-display">
      {/* Bootstrap Card component */}
      <Card className="text-white bg-transparent">
        <Card.Body>
          <Card.Title className="text-center">{getCurrentDate()}</Card.Title>

          <div className="current-conditions d-flex justify-content-center align-items-center">
            <div className="degree">
              <h2>{degree}°{unit === 'metric' ? 'C' : 'F'}</h2>
            </div>
            <img src={img} alt="weather icon" className="ml-3" />
          </div>

          <div className="current text-center mt-3">
            <p className="humidity">Humidity: {humidity}%</p>
            <p className="wind-speed">Wind Speed: {windSpeed} km/h</p>
          </div>

          <div className="forecast">
            {displayForecast(forecast)}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default WeatherDisplay;
