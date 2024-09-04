import React from "react";

class UsersPerm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      newPermission: "",
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePermissionChange = this.handlePermissionChange.bind(this);
    this.handleFormSub = this.handleFormSub.bind(this);
  }

  handleNameChange(e) {
    this.setState({
      userName: e.target.value,
    });
  }

  handlePermissionChange(e) {
    this.setState({
      newPermission: e.target.value,
    });
  }

  // form submission
  async handleFormSub(e) {
    e.preventDefault();

    const { userName, newPermission } = this.state;
    const { token } = this.props;

    await fetch("http://localhost:8000/user/perms", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userName,
        newPermission,
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
    const { userName, newPermission } = this.state;

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
          <label>New Permission:</label>
          <br />
          <select
            onChange={this.handlePermissionChange}
            value={newPermission}
            required
          >
            <option value="">Select Permission</option>
            <option value="normal">Normal</option>
            <option value="manage">Management</option>
            <option value="admin">Admin</option>
          </select>
          <br />
          <button type="submit">Change Permissions</button>
        </form>
      </div>
    );
  }
}

export default UsersPerm;
