import React, { Component } from "react";
import firebase, { auth } from "~/fire";
import Routes from "./Routes";
import Login from "./Login";
import { Navbar } from "./Navbar";
import Stories from "./Stories";

export const welcome = user => {
  if (!user) return "";
  if (user.isAnonymous) return "";
  return "Hello, " + user.displayName || "Hello, " + user.email;
};

export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      user: {},
      userName: "",
      userEmail: "",
      uid: ""
    };
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user =>
      this.setState({
        user
      })
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <div className="page">
        <nav>
          <Navbar user={this.state.user} />
        </nav>
        <br />
        <Routes user={this.state.user} />
      </div>
    );
  }
}
