import React from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      pword: "",
    };

    this.handleUserName = this.handleUserName.bind(this);
    this.handlePword = this.handlePword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  async handleSubmit(e) {
    e.preventDefault();

    const { setToken, setUserInfo, setUsableOrgUnits, setUsableDivs } =
      this.props;
    const { userName, pword } = this.state;

    await fetch("http://localhost:8000/user/login", {
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
          setToken(result.token);
          setUserInfo(result.user);
          setUsableDivs(result.usableDivs);
          setUsableOrgUnits(result.usableOrgUnits);
          alert(result.message);
        },
        (error) => {
          alert("Error " + error.message);
        }
      );

    this.setState({
      userName: "",
      pword: "",
    });
  }

  render() {
    return (
      <div className="Login--container">
        <form onSubmit={this.handleSubmit} className="Login--form">
          <label className="Reg--label">UserName:</label>
          <br></br>
          <input
            value={this.state.userName}
            onChange={this.handleUserName}
            className="Reg--input"
            required
          />
          <br></br>
          <label className="Reg--label">Password:</label>
          <br></br>
          <input
            type="password"
            value={this.state.pword}
            onChange={this.handlePword}
            className="Reg--input"
            required
          />
          <br></br>
          <button type="submit" className="Login--button">
            Login
          </button>
        </form>
        {/* <button */}
      </div>
    );
  }
}

export default Login;
