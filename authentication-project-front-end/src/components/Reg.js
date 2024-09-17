import React from "react";

class Reg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      pword: "",
      pword2: "",
    };

    // bind functions
    this.handleUserName = this.handleUserName.bind(this);
    this.handlePword = this.handlePword.bind(this);
    this.handlePword2 = this.handlePword2.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  // handle change functions
  handleUserName(e) {
    this.setState({
      userName: e.target.value,
    });
  }

  handlePword(e) {
    this.setState({
      pword: e.target.value,
    });
  }

  handlePword2(e) {
    this.setState({
      pword2: e.target.value,
    });
  }

  // form submission function
  async handleFormSubmit(e) {
    e.preventDefault();

    const { userName, pword, pword2 } = this.state;

    // check if passwords are the same
    if (pword !== pword2) {
      alert("Passwords do not match");
      this.setState({
        pword2: "",
      });
      return;
    } else {
      // Register user to database
      await fetch("http://localhost:8000/user/reg", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          pword,
        }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            alert(result.message);
          },
          (error) => {
            alert("Error: " + error.message);
          }
        );

      // Reset form
      this.setState({
        userName: "",
        pword: "",
        pword2: "",
      });
    }
  }

  render() {
    const { pword, userName, pword2 } = this.state;

    return (
      <div className="Reg--container">
        <form onSubmit={this.handleFormSubmit} className="Reg--form">
          <label className="Reg--label">Username:</label>

          <input
            value={userName}
            onChange={this.handleUserName}
            className="Reg--input"
            required
          />

          <label className="Reg--label">Password:</label>

          <input
            type="password"
            value={pword}
            onChange={this.handlePword}
            className="Reg--input"
            required
          />

          <label className="Reg--label">Re-Enter Password:</label>

          <input
            type="password"
            value={pword2}
            onChange={this.handlePword2}
            className="Reg--input"
            required
          />

          <button type="submit" className="Reg--button">
            Register
          </button>
        </form>
      </div>
    );
  }
}

export default Reg;
