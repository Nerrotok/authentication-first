import React from "react";

class UsersAddOrg extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      orgUnit: "",
    };

    this.handleOrgChange = this.handleOrgChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleFormSub = this.handleFormSub.bind(this);
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

  async handleFormSub(e) {
    e.preventDefault();

    const { userName, orgUnit } = this.state;
    const { token } = this.props;

    await fetch("http://localhost:8000/user/addorg", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userName,
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
    const { userName, orgUnit } = this.state;

    return (
      <div className="Users--container">
        <form onSubmit={this.handleFormSub} className="Users--form">
          <label>User Name:</label>
          <br />
          <input
            onChange={this.handleNameChange}
            value={userName}
            type="text"
            required
          />
          <br />
          <label>Org Unit to Add:</label>
          <br />
          <input
            onChange={this.handleOrgChange}
            value={orgUnit}
            type="text"
            required
          />
          <br />
          <button type="submit">Submit Org Unit</button>
        </form>
      </div>
    );
  }
}

export default UsersAddOrg;
