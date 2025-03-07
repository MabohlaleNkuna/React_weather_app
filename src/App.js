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
  const [humidity, setHumidity] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [unit, setUnit] = useState('metric');
  const [viewType, setViewType] = useState('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [savedLocations, setSavedLocations] = useState([]);

  useEffect(() => {
    // Load saved data from local storage
    const loc = localStorage.getItem("location");
    const deg = localStorage.getItem("degree");
    const fore = localStorage.getItem("forecast");
    const main = localStorage.getItem("main");
    const img = localStorage.getItem("img");
    const humidity = localStorage.getItem("humidity");
    const windSpeed = localStorage.getItem("windSpeed");
    const unit = localStorage.getItem("unit");
    const viewType = localStorage.getItem("viewType");
    const darkMode = localStorage.getItem("isDarkMode") === 'true';
    const savedLocs = localStorage.getItem("savedLocations");
    //const savedLocationsArray = savedLocs ? savedLocs.split(',') : [];

    if (loc) setLocation(loc);
    if (deg) setDegree(deg);
    if (fore) setForecast(JSON.parse(fore));
    if (main) setMain(main);
    if (img) setImg(img);
    if (humidity) setHumidity(humidity);
    if (windSpeed) setWindSpeed(windSpeed);
    if (unit) setUnit(unit);
    if (viewType) setViewType(viewType);
    setIsDarkMode(darkMode);
    if (savedLocs) setSavedLocations(savedLocs);
  }, []);

  useEffect(() => {
    // Save data to local storage whenever any state changes
    localStorage.setItem("location", location);
    localStorage.setItem("degree", degree);
    localStorage.setItem("forecast", JSON.stringify(forecast));
    localStorage.setItem("main", main);
    localStorage.setItem("img", img);
    localStorage.setItem("humidity", humidity);
    localStorage.setItem("windSpeed", windSpeed);
    localStorage.setItem("unit", unit);
    localStorage.setItem("viewType", viewType);
    localStorage.setItem("isDarkMode", isDarkMode);

    // Save saved locations as a comma-separated string
    localStorage.setItem("savedLocations", savedLocations);
  }, [location, degree, forecast, main, img, humidity, windSpeed, unit, viewType, isDarkMode, savedLocations]);

  const temperatureConverter = (temp, unit) => {
    return unit === 'imperial' ? Math.round(temp * 9 / 5 + 32) : Math.round(temp);
  };

  const handleWeatherResponse = useCallback((res) => {
    const data = res.data;
    if (!data.current) {
      return;
    }
  
    const temp = temperatureConverter(data.current.temp_c, unit);  // unit is used here
    const imgSource = data.current.condition.icon;
  
    setLocation(`${data.location.name}, ${data.location.country}`);
    setDegree(temp);
    setMain(data.current.condition.text);
    setImg(imgSource);
    setHumidity(data.current.humidity);
    setWindSpeed(data.current.wind_kph);
  
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=dd64f007451b4300b1381555240208&q=${data.location.name}&days=7&aqi=no&alerts=no`;
    axios.get(forecastUrl).then(res => {
      if (!res.data.forecast || !res.data.forecast.forecastday) {
        return;
      }
  
      let weatherList = [];
      res.data.forecast.forecastday.forEach((day) => {
        day.hour.forEach((hourData) => {
          if (hourData) {
            let hour = new Date(hourData.time_epoch * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temp = temperatureConverter(hourData.temp_c, unit);  // unit is used here
            const description = hourData.condition.text;
            const img = hourData.condition.icon;
  
            weatherList.push({ hour, temp, description, img });
          }
        });
      });
      setForecast(weatherList);
    });
  }, [unit]);  
  

  const fetchWeatherData = useCallback((query = '') => {
    let url;
  
    if (query) {
      url = `https://api.weatherapi.com/v1/current.json?key=dd64f007451b4300b1381555240208&q=${query}`;
      axios.get(url).then(res => handleWeatherResponse(res));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          url = `https://api.weatherapi.com/v1/current.json?key=dd64f007451b4300b1381555240208&q=${latitude},${longitude}`;
          axios.get(url).then(res => handleWeatherResponse(res));
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
  }, [unit, handleWeatherResponse]); 
  

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const handlePopupConfirm = () => {
    setShowLocationPopup(false);
    fetchWeatherData();
  };

  const handlePopupDeny = () => {
    setShowLocationPopup(false);
    setPopupMessage('');
    document.querySelector('.search-bar input').focus();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData(searchQuery);
  };

  const handleSaveLocation = () => {
    setSavedLocations(prev => {
      const updatedLocations = [...prev, location];
      //localStorage.setItem("savedLocations", updatedLocations.join(','));
      return updatedLocations;
    });
  };

  const handleViewSavedLocations = () => {
    alert(`Saved locations: ${savedLocations}`);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
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
        <button onClick={handleToggleDarkMode}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <WeatherDisplay
        degree={degree}
        main={main}
        img={img}
        humidity={humidity}
        windSpeed={windSpeed}
        forecast={forecast}
        viewType={viewType}
        unit={unit}
      />
      <SMSRegistration />

      <div className="buttons">
        <button onClick={handleSaveLocation}>Save Location</button>
        <button onClick={handleViewSavedLocations}>View Saved Locations</button>
      </div>

      {showLocationPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
          <button onClick={handlePopupConfirm}>Allow</button>
          <button onClick={handlePopupDeny}>Deny</button>
        </div>
      )}
    </div>
  );
};

export default App;
