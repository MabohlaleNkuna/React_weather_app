import React from 'react';


const ForecastItem = ({ hour, temp, description, img }) => {
  return (
    <div className="forecast-item">
      <p className="hour">{hour}</p>
      <img src={img} alt={description} />
      <p className="temp">{temp}°</p>
      <p className="description">{description}</p>
    </div>
  );
};

export default ForecastItem;
