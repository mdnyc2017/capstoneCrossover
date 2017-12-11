import React from 'react';
import Login from './Login';
import { auth } from '../fire'

export const Navbar = ({ user }) =>  

(  
  <div>
    <div className="navbar">
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
        <a href="/">
          <li className="navbar-li">
          Home
          </li>
        </a>
        <a href="/stories/new">
          <li className="navbar-li">
            Add Stories
          </li>
        </a>
        <a href="/stories">
          <li className="navbar-li">
            Stories
          </li>
        </a>
        <li className="navbar-li-r" onClick={() => auth.signOut()}>
          Logout
        </li>
      </ul>
      )}
    </div>
  </div>
);

