import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import WeatherDisplay from './components/WeatherDisplay';
import SMSRegistration from './components/SMSRegistration';
import './App.css';

const App = () => {
  const [location, setLocation] = useState('');
  const [degree, setDegree] = useState('');
  const [forecast, setForecast] = useState([]);
  const [main, setMain] = useState('');
  const [img, setImg] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [viewType, setViewType] = useState('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Convert temperature based on unit
  const temperatureConverter = (temp, unit) => {
    return unit === 'imperial' ? Math.round(temp * 9 / 5 + 32) : Math.round(temp);
  };

  // Handle weather data response
  const handleWeatherResponse = useCallback((res) => {
    const data = res.data;
    const temp = temperatureConverter(data.main.temp, unit);
    const imgSource = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

    setLocation(`${data.name}, ${data.sys.country}`);
    setDegree(temp);
    setMain(data.weather[0].main);
    setImg(imgSource);

    // Fetch forecast data
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=b8a29f5c70c06239c55aedb78e5614f0&units=${unit}&q=${data.name}`;
    axios.get(forecastUrl).then(res => {
      let weatherList = [];
      res.data.list.forEach((obj) => {
        let utc = obj.dt;
        let d = new Date(0);
        d.setUTCSeconds(utc);
        let hour = d.getHours();
        hour = hour < 13 ? `${hour} AM` : `${hour - 12} PM`;
        const temp = temperatureConverter(obj.main.temp, unit);
        const description = obj.weather[0].main;
        const prefix = 'https://res.cloudinary.com/marvel451/image/upload/';
        let weatherIcons = [
          'v1525070596/sunny.svg',
          'v1525070599/cloud-one_iiddgh.svg',
          'v1525070596/cloud-three_isrrou.svg',
          'v1525070596/thunder_hw7uyx.svg',
          'v1525140183/snowy.svg',
          'v1525070596/slightly-cloudy-day_ljjffu.svg',
          'v1525070596/slightly-cloudy-night_xchkwe.svg'
        ];

        let img = null;

        switch(description) {
          case "clear sky": img = `${prefix + weatherIcons[0]}`; break;
          case "rain": img = `${prefix + weatherIcons[1]}`; break;
          case "shower rain": img = `${prefix + weatherIcons[2]}`; break;
          case "thunderstorm": img = `${prefix + weatherIcons[3]}`; break;
          case "snow": img = `${prefix + weatherIcons[4]}`; break;
          case "clouds":
          case "scattered clouds":
          case "few clouds": img = `${prefix + weatherIcons[5]}`; break;
          default: img = `${prefix + weatherIcons[6]}`; break;
        }

        weatherList.push({ hour, temp, description, img });
      });
      setForecast(weatherList);
    });
  }, [unit]);

  // Fetch weather data based on query or geolocation
  const fetchWeatherData = useCallback((query = '') => {
    let url;

    if (query) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=b8a29f5c70c06239c55aedb78e5614f0&units=${unit}`;
      axios.get(url).then(res => handleWeatherResponse(res));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Geolocation access granted');
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b8a29f5c70c06239c55aedb78e5614f0&units=${unit}`;
          axios.get(url).then(res => handleWeatherResponse(res));
        },
        (error) => {
          console.error('Geolocation access denied or error:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setPopupMessage('Location access is required. Please allow access or enter a location manually.');
            setShowLocationPopup(true);
          } else {
            alert('Unable to access location. Please ensure location services are enabled.');
          }
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, [unit, handleWeatherResponse]);

  // Effect to fetch weather data on mount or dependency change
  useEffect(() => {
    // Request user location on initial render
    const requestUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            // If location is granted, proceed with fetching weather data
            fetchWeatherData();
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setPopupMessage('Location access is required. Please allow access or enter a location manually.');
              setShowLocationPopup(true);
            } else {
              alert('Unable to access location. Please ensure location services are enabled.');
            }
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
    };

    requestUserLocation();
  }, [fetchWeatherData]);

  // Confirm location access and retry fetching weather data
  const handlePopupConfirm = () => {
    setShowLocationPopup(false);
    fetchWeatherData();
  };

  // Deny location access and allow manual location entry
  const handlePopupDeny = () => {
    setShowLocationPopup(false);
    setPopupMessage('');
    document.querySelector('.search-bar input').focus();
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData(searchQuery);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header location={location} reloadApp={() => fetchWeatherData()} />
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="view-switch">
        <button onClick={() => setViewType('hourly')}>Hourly</button>
        <button onClick={() => setViewType('daily')}>Daily</button>
        <button onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}>
          {unit === 'metric' ? '°C' : '°F'}
        </button>
        <button onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <WeatherDisplay
        degree={degree}
        main={main}
        forecast={forecast}
        img={img}
        viewType={viewType}
        unit={unit}
      />
      <SMSRegistration />
      {showLocationPopup && (
        <div className="location-popup">
          <p>{popupMessage}</p>
          <button onClick={handlePopupConfirm}>Allow</button>
          <button onClick={handlePopupDeny}>Enter Location Manually</button>
        </div>
      )}
    </div>
  );
};

export default App;
