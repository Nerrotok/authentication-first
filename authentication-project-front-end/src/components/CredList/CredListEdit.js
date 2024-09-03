import React from "react";

class CredListEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldToEdit: "pword",
      editData: "",
      name: "",
    };
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFieldChange(e) {
    this.setState({
      fieldToEdit: e.target.value,
    });
  }

  handleDataChange(e) {
    this.setState({
      editData: e.target.value,
    });
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  // function to update credentional
  async handleSubmit(e) {
    e.preventDefault();

    const { fieldToEdit, name, editData } = this.state;
    const { orgUnit, division, token } = this.props;

    if (orgUnit === "" || division === null || division === "") {
      alert("Pick an orgUnit and a division.");
      return;
    }

    try {
      await fetch("http://localhost:8000/divrepos/update", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          credName: name,
          areaToUpdate: fieldToEdit,
          update: editData,
          orgUnit,
          division,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error occurred: " + res.status);
          }
          return res.json();
        })
        .then((result) => {
          alert(result.message);
        });
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  render() {
    const { editData, fieldToEdit, name } = this.state;

    return (
      <div className="CredListEdit--container">
        <h3 className="CreditList--heading">Edit Credential</h3>
        <form onSubmit={this.handleSubmit} className="CredListEdit--form">
          <label className="CredListEdit--label">Name</label>
          <br></br>
          <input
            onChange={this.handleNameChange}
            value={name}
            className="CredList--input"
            required
          />
          <br></br>
          <label>Field To Edit</label>
          <br></br>
          <select value={fieldToEdit} onChange={this.handleFieldChange}>
            <option value="pword">Password</option>
            <option value="login">Login</option>
            <option value="name">Name</option>
          </select>
          <br></br>
          <label className="CredListEdit--label">Edited Data</label>
          <br></br>
          <input
            onChange={this.handleDataChange}
            value={editData}
            type="text"
            required
          />
          <br></br>
          <button className="CredListEdit--button">Edit Data</button>
        </form>
      </div>
    );
  }
}

export default CredListEdit;
