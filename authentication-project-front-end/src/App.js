import "./App.css";
import Reg from "./components/Reg";
import Login from "./components/Login";
import Logout from "./components/Logout";
import CredList from "./components/CredList/CredList";
import Users from "./components/Users/Users";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import React from "react";

function App() {
  // State setters
  const [userInfo, setUserInfo] = React.useState(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    // JSON returns
    return storedUserInfo ? JSON.parse(storedUserInfo) : [];
  });

  const [token, setToken] = React.useState(
    () => localStorage.getItem("token") || ""
  );

  const [usableDivs, setUsableDivs] = React.useState(() => {
    const storedUsableDivs = localStorage.getItem("usableDivs");
    // JSON returns
    return storedUsableDivs ? JSON.parse(storedUsableDivs) : [];
  });

  const [usableOrgUnits, setUsableOrgUnits] = React.useState(() => {
    const storedUsableOrgUnits = localStorage.getItem("usableOrgUnits");
    // JSON returns
    return storedUsableOrgUnits ? JSON.parse(storedUsableOrgUnits) : [];
  });

  // When state changes, update local storage
  React.useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  React.useEffect(() => {
    if (userInfo) localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  React.useEffect(() => {
    if (usableDivs)
      localStorage.setItem("usableDivs", JSON.stringify(usableDivs));
  }, [usableDivs]);

  React.useEffect(() => {
    if (usableOrgUnits)
      localStorage.setItem("usableOrgUnits", JSON.stringify(usableOrgUnits));
  }, [usableOrgUnits]);

  return (
    <div className="App--container">
      <h1 className="App--heading">Cool Tech Login Info App</h1>

      <Navigation />
      <Logout
        userName={userInfo.name}
        setUserInfo={setUserInfo}
        setToken={setToken}
        setUsableDivs={setUsableDivs}
        setUsableOrgUnits={setUsableOrgUnits}
      />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Login
              setUsableOrgUnits={setUsableOrgUnits}
              setUsableDivs={setUsableDivs}
              setUserInfo={setUserInfo}
              setToken={setToken}
            />
          }
        />
        <Route exact path="/reg" element={<Reg />} />
        <Route
          path="/credlist"
          element={
            <CredList
              usableDivs={usableDivs}
              usableOrgUnits={usableOrgUnits}
              token={token}
              userInfo={userInfo}
              permissions={userInfo.permissions}
            />
          }
        />
        <Route
          exact
          path="/user"
          element={<Users permissions={userInfo.permissions} token={token} />}
        />
      </Routes>
    </div>
  );
}

export default App;
