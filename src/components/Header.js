import React from 'react';

class Header extends React.Component {
  reloadApp = () => {
    this.props.reloadApp();
  };

  render() {
    return (
      <header className="app-header">
        <img
          src='https://res.cloudinary.com/marvel451/image/upload/v1525133241/sun-cloud_s558lu.png'
          className="app-logo"
          alt="logo"
        />
        <h1 className="app-title">Weather App</h1>
        <p className="app-intro">Current weather at</p>
        <h2>{this.props.location} </h2>
     
      </header>
    );
  }
}

export default Header;
