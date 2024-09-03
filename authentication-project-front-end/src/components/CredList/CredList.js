import React from "react";
import CredListAdd from "./CredListAdd";
import CredListEdit from "./CredListEdit";

class CredList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // chosen org unit
      orgUnit: "",
      // divisions within selected OU
      divisions: [],
      // chosen div
      div: "",
      // user token
      token: props.token,
      // cred items
      creds: [],
      // loading handler
      loaded: true,

      selectedComponent: "",
    };

    // bind functions
    this.handleDivChange = this.handleDivChange.bind(this);
    this.handleOrgUnitChange = this.handleOrgUnitChange.bind(this);
    this.updateDivisions = this.updateDivisions.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  // handle orgUnit choice
  async handleOrgUnitChange(e) {
    this.setState({
      div: null,
      loaded: false,
    });
    // update divisions
    this.updateDivisions(e.target.value);
  }

  // handle divisionChoice
  handleDivChange(e) {
    this.setState({
      div: e.target.value,
    });
  }

  // Function which gets divisions which are in chosenOrgUnit
  async updateDivisions(orgUnit) {
    const { usableOrgUnits, usableDivs } = this.props;

    // case for none chosen
    if (orgUnit === "") {
    } else {
      // find the chosen orgUnitObject
      const chosenOrgUnit = await usableOrgUnits.find(
        (unit) => unit.name === orgUnit
      );

      let divisionArray = [];

      // get division which are in the chosenOrgUnit
      for (let i = 0; i < usableDivs.length; i++) {
        if (usableDivs[i].orgUnit === chosenOrgUnit._id) {
          divisionArray.push(usableDivs[i].name);
        }
      }

      // set state for divisions
      this.setState({ divisions: divisionArray, loaded: true, orgUnit });
    }
  }

  handleDropdownChange(e) {
    this.setState({
      selectedComponent: e.target.value,
    });
  }

  // function to fetch credentials
  async handleButtonClick(e) {
    e.preventDefault();

    const { token, orgUnit, div } = this.state;

    if (orgUnit === "" || div === null || div === "") {
      alert("Pick an orgUnit and a division.");
      return;
    }

    await fetch("http://localhost:8000/divrepos/creds", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        orgUnit,
        division: div,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ` + res.stats);
        }
        return res.json();
      })
      .then((result) => {
        this.setState({
          creds: result,
        });
      });
  }

  render() {
    const { usableOrgUnits, permissions } = this.props;
    const { creds, token, orgUnit, div, divisions, loaded } = this.state;
    let editOption;

    if (!token) {
      return (
        <div className="CredList--container">
          <h1>Please login and come back</h1>
        </div>
      );
    } else if (!loaded) {
      <div className="CredList--container">
        <h1>Loading...</h1>
      </div>;
    }

    if (permissions === "admin" || permissions === "manage") {
      editOption = <option value="edit">Edit Credentials</option>;
    } else {
      editOption = <option>Unavailable</option>;
    }

    return (
      <div className="CredList--container">
        <div className="CredList--container">
          <h3 className="CredList--heading">
            Select Org Unit and Division for operations:
          </h3>
          <label className="CredList--label">Organisational Unit</label>
          <br />
          <select
            className="CredList--dropdown"
            value={orgUnit}
            onChange={this.handleOrgUnitChange}
          >
            <option value="">Select an OU</option>
            {usableOrgUnits.map((unit) => (
              <option key={unit._id} value={unit.name}>
                {unit.name}
              </option>
            ))}
          </select>

          <div className="CredList--container">
            {orgUnit && (
              <div className="CredList--container">
                <label className="CredList--Label">Division</label>
                <br />
                <select
                  className="CredList--dropdown"
                  value={div || ""}
                  onChange={this.handleDivChange}
                >
                  <option value="">Select a Division</option>
                  {divisions.map((division, index) => (
                    <option key={index} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              className="CredList--button-getCreds"
              onClick={this.handleButtonClick}
            >
              Get Credentials
            </button>
          </div>
        </div>

        {/* Conditionally render actions and table based on selection */}
        {orgUnit && div && (
          <div className="CredList--container">
            <select
              className="CredList--dropdown"
              value={this.state.selectedComponent}
              onChange={this.handleDropdownChange}
            >
              <option value="">Select an Action</option>
              <option value="add">Add Credentials</option>
              {editOption}
            </select>

            {/* Conditionally render components based on dropdown selection */}
            {this.state.selectedComponent === "add" && (
              <CredListAdd token={token} orgUnit={orgUnit} division={div} />
            )}
            {this.state.selectedComponent === "edit" && (
              <CredListEdit token={token} orgUnit={orgUnit} division={div} />
            )}
          </div>
        )}

        {orgUnit && div && (
          <table className="CredList--table">
            <thead className="CredList--thead">
              <tr className="CredList--tr">
                <th className="CredList--th">Name</th>
                <th className="CredList--th">User Name</th>
                <th className="CredList--th">Password</th>
              </tr>
            </thead>
            <tbody className="CredList--tbody">
              {creds.map((cred) => (
                <tr className="CredList--tr" key={cred._id}>
                  <td className="CredList--td">{cred.name}</td>
                  <td className="CredList--td">{cred.login}</td>
                  <td className="CredList--td">{cred.pword}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default CredList;
