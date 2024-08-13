import React from 'react';

class Header extends React.Component {
  reloadApp = () => {
    this.props.reloadApp();
  };

  render() {
    return (
      <header className="app-header">
        <h1>{this.props.location}</h1>
      </header>
    );
  }
}

export default Header;
