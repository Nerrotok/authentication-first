import React from "react";
import UsersAddDiv from "./UsersAddDiv";
import UsersSubDiv from "./UsersSubDiv";
import UsersAddOrg from "./UsersAddOrg";
import UsersSubOrg from "./UsersSubOrg";
import UsersPerm from "./UsersPerm";

class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAction: "addDivision",
    };

    this.handleDropDown = this.handleDropDown.bind(this);
  }

  // Handle dropdown selection change
  handleDropDown(e) {
    this.setState({ selectedAction: e.target.value });
  }

  render() {
    const { permissions, token } = this.props;
    const { selectedAction } = this.state;

    if (token === "") {
      return <h1>Please login</h1>;
    } else if (permissions !== "admin") {
      return (
        <div className="Users--container">
          <h1 className="Users--heading">
            This functionality is only available to admins
          </h1>
        </div>
      );
    }

    return (
      <div className="Users--container">
        <h3 className="Users--heading">User Management</h3>
        <select onChange={this.handleDropDown} value={selectedAction}>
          <option value="addDivision">Add Division to User</option>
          <option value="subDivision">Remove Division from User</option>
          <option value="addOrgUnit">Add Org Unit to User</option>
          <option value="subOrgUnit">Remove Org Unit from User</option>
          <option value="changePerms">Change User Permissions</option>
        </select>
        {selectedAction === "addDivision" && <UsersAddDiv token={token} />}
        {selectedAction === "subDivision" && <UsersSubDiv token={token} />}
        {selectedAction === "addOrgUnit" && <UsersAddOrg token={token} />}
        {selectedAction === "subOrgUnit" && <UsersSubOrg token={token} />}
        {selectedAction === "changePerms" && <UsersPerm token={token} />}
      </div>
    );
  }
}

export default Users;
