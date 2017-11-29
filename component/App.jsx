import React, { Component } from "react";
import firebase, { auth } from "~/fire";
import Routes from "./Routes";
import Login from "./Login";
import { Navbar } from "./Navbar";
import Stories from './Stories'


export const welcome = user => {
  if (!user) return "";
  if (user.isAnonymous) return "";
  return "Hello, " + user.displayName || "Hello, " + user.email;
};

export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    // let user = firebase.auth().currentUser
    // let uid = firebase.auth().currentUser.uid
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    // console.log('!1 at login, current user is: ', user)
    
    // const { user } = this.state || {};

    //making a call to firebase to grab the currently logged in user's data
    const user = firebase.auth().currentUser
    console.log('APP logged in user is: ', user)
    
    
    return (
      <div className="page">
        <nav>
          <Navbar user={user} auth={auth} />
        </nav>
        <br />
        <Routes user={user} />
      </div>
    );
  }
}
