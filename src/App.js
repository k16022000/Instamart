import React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import HomePage from "./HomePage";
import PackageCreation from "./PackageCreation";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/HomePage" exact component={HomePage} />
          <Route path="/PackageCreation" exact component={PackageCreation} />
        </Switch>
      </Router>
    </div >
  )
}
export default App