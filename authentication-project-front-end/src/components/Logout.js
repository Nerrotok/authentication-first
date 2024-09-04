import React from "react";

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleLogOutClick = this.handleLogOutClick.bind(this);
  }

  handleLogOutClick(e) {
    e.preventDefault();

    const { userName } = this.props;

    if (!userName) {
      alert("Already logged out");
      return;
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("usableDivs");
      localStorage.removeItem("usableOrgUnits");

      alert(`${userName} has logged out`);
    }
  }

  render() {
    return (
      <button className="Logout--button" onClick={this.handleLogOutClick}>
        Logout
      </button>
    );
  }
}

export default Logout;
