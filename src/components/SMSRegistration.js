import React from 'react';

class SMSRegistration extends React.Component {
  registerUser = (event) => {
    event.preventDefault();
    const phoneNumber = event.target.sms.value;
    if (!phoneNumber) {
      alert("Please give us your phone number");
      return;
    }
    if (phoneNumber.match(/\d/g).length === 10) {
      alert("You have been registered!");
    } else {
      alert("Please double check your numbers");
    }
  }

  render() {
    return (
      <section className="app-sms">
        <p>Register for SMS alerts for this location</p>
        <form className="form-inline" onSubmit={this.registerUser} name="updates">
          <input type="text" name="sms" placeholder="555-555-555" className="phone-input"/><br />
          <button type="submit" className="btn btn-primary submit-button">Get alerts</button>
        </form>
      </section>
    );
  }
}

export default SMSRegistration;
