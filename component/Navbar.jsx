import React, { Component } from "react";
import firebase, { auth } from "~/fire";
import Login from "./Login";


export const Navbar = ({ user, auth }) =>  
(  <div className="navbar"> 
    {!user || user.isAnonymous ? (
    <ul className="navbar-ul">
      <li className="navbar-li">
        <a href="/">Home</a>
      </li>
      <li className="navbar-li">
        <Login>Login with Google</Login>
      </li>
    </ul>
    ) : (
    <ul className="navbar-ul">
      <li className="navbar-li">
        <a href="/">Home</a>
      </li>
      <li className="navbar-li">
        <a href="/stories/new">Add Stories</a>
      </li>
      <li className="navbar-li">
        <a href="/stories">Stories</a>
      </li>
      <li className="navbar-li" onClick={() => auth.signOut()}>
        Logout
      </li>
    </ul>
    )}
  </div>
);
