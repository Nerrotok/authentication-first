import React from "react";

class UsersSubDiv extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      orgUnit: "",
      division: "",
    };

    this.handleDivChange = this.handleDivChange.bind(this);
    this.handleFormSub = this.handleFormSub.bind(this);
    this.handleOrgChange = this.handleOrgChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(e) {
    this.setState({
      userName: e.target.value,
    });
  }

  handleOrgChange(e) {
    this.setState({
      orgUnit: e.target.value,
    });
  }

  handleDivChange(e) {
    this.setState({
      division: e.target.value,
    });
  }

  // form submission
  async handleFormSub(e) {
    e.preventDefault();

    const { userName, division, orgUnit } = this.state;
    const { token } = this.props;

    await fetch("http://localhost:8000/user/subdiv", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userName,
        division,
        orgUnit,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result.message);
        },
        (error) => {
          alert(error.message);
        }
      );
  }

  render() {
    const { userName, division, orgUnit } = this.state;

    return (
      <div className="Users--container">
        <form onSubmit={this.handleFormSub} className="Users--form">
          <label>Username:</label>

          <input
            onChange={this.handleNameChange}
            value={userName}
            type="text"
            required
          />

          <label>Org Unit:</label>

          <input
            onChange={this.handleOrgChange}
            value={orgUnit}
            type="text"
            required
          />

          <label>Division to Remove:</label>

          <input
            onChange={this.handleDivChange}
            value={division}
            type="text"
            required
          />

          <button className="UsersSubDiv--button" type="submit">
            Submit Division
          </button>
        </form>
      </div>
    );
  }
}

export default UsersSubDiv;
