import React from 'react';

class Header extends React.Component {
  reloadApp = () => {
    this.props.reloadApp();
  };

  render() {
    return (
      <header className="app-header">
    
        <h1 className="app-title">Mabohlale's Weather App</h1>
        <p className="app-intro">Current weather at</p>
        <h2>{this.props.location} </h2>
     
      </header>
    );
  }
}

export default Header;
