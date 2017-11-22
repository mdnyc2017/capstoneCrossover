import React, { Component } from 'react';
import firebase, { auth } from '~/fire';
import Login from './Login';

export const Navbar = ({ user, auth }) =>
  (
    <div className="navbar">
        <ul className="navbar-ul">
        <a href="/"><li className="navbar-li">Home</li></a>
        <a href="/stories/new"><li className="navbar-li">Add Stories</li></a>
        <a href="/stories"><li className="navbar-li">Stories</li></a>
                {((!user || user.isAnonymous))
                    ? 
                        <Login>
                            Login with Google
                        </Login>
                    :
                    <li
                        className="navbar-li"
                        onClick={() => auth.signOut()}
                    >Logout
                    </li>
                }
        </ul>
    </div>
)