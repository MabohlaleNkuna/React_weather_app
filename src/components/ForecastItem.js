import React from 'react';

const ForecastItem = ({ hour, temp, description, img }) => {
  return (
    <div className="forecast-item">
      <p>{hour}</p>
      <img src={img} alt={description} />
      <p>{temp}°</p>
      <p>{description}</p>
    </div>
  );
};

export default ForecastItem;
