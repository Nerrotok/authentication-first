import React from "react";

class CredListAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      pword: "",
      placeName: "",
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePassWordChange = this.handlePassWordChange.bind(this);
    this.handlePlaceNameChange = this.handlePlaceNameChange.bind(this);
  }

  // form handlers
  handleLoginChange(e) {
    this.setState({
      userName: e.target.value,
    });
  }

  handlePassWordChange(e) {
    this.setState({
      pword: e.target.value,
    });
  }

  handlePlaceNameChange(e) {
    this.setState({
      placeName: e.target.value,
    });
  }

  // form submission handle
  async handleFormSubmit(e) {
    e.preventDefault();

    const { token, orgUnit, division } = this.props;
    const { userName, pword, placeName } = this.state;

    if (division === "" || division === null || orgUnit === "") {
      alert("Enter an OrgUnit and a division");
    }
    try {
      // adds new stuff to DB
      await fetch("http://localhost:8000/divrepos/add", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          orgUnit,
          division,
          name: placeName,
          login: userName,
          password: pword,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error occurred " + res.status);
          }
          return res.json();
        })
        .then((result) => {
          alert(result.message);
        });
    } catch (error) {
      alert(error.message);
    }
  }

  render() {
    const { userName, pword, placeName } = this.state;

    return (
      <div className="CreadListAdd--container">
        <h3 className="CredListAdd--heading">Add Credentials</h3>
        <form onSubmit={this.handleFormSubmit} className="CredListAdd--form">
          <label className="CredListAdd--label">Place Name</label>
          <br></br>
          <input
            className="CredListAdd--input"
            value={placeName}
            onChange={this.handlePlaceNameChange}
            type="text"
            required
          />
          <br></br>
          <label className="CredListAdd--label">Login</label>
          <br></br>
          <input
            className="CredListAdd--input"
            value={userName}
            onChange={this.handleLoginChange}
            type="text"
            required
          />
          <br></br>
          <label className="CredListAdd--label">Password</label>
          <br></br>
          <input
            className="CredListAdd--input"
            value={pword}
            onChange={this.handlePassWordChange}
            type="text"
            required
          />
          <br></br>
          <button className="CredListAdd--button">Add Credentials</button>
        </form>
      </div>
    );
  }
}

export default CredListAdd;
