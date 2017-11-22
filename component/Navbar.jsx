import React, { Component } from 'react';
import firebase, { auth } from '~/fire';
import Login from './Login';

export const Navbar = ({ user, auth }) =>
  (
    <div className="navbar">
        <ul className="navbar-ul">
        {/* link to home commented out as home component not ready yet */}
        <li className="navbar-li"><a href="/">Home</a></li>
        <li className="navbar-li"><a href="/stories/new">Add Stories</a></li>
        <li className="navbar-li"><a href="/stories">Stories</a></li>
        {((!user || user.isAnonymous))
            ? <Login className="navbar-li">
            Login with Google
                </Login>
            :
            <li
                className="navbar-li"
                onClick={() => auth.signOut()}
            >logout
            </li>
            }
        </ul>
    </div>
)