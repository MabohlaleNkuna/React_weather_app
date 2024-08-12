import React from 'react';

const ForecastItem = ({ day, hour, temp, description, img }) => {
  return (
    <div className="forecast-item">
      {day && <div className="day-name">{day}</div>}
      {hour && <div className="hour">{hour}</div>}
      <img src={img} alt={description} className="forecast-icon" />
      <div className="temperature">{temp}°</div>
      <div className="description">{description}</div>
    </div>
  );
};

export default ForecastItem;
