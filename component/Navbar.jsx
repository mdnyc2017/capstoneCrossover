import React, { Component } from 'react';
import firebase, { auth } from '~/fire';
import { Switch, Route, NavLink, HashRouter } from 'react-router-dom';
import Routes from './Routes';
import Login from './Login';
import AddScene from './AddScene';
import AddStory from './AddStory';
import Stories from './Stories';

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
  );


// <div>
// {/* <Route path='/' component={App} /> */}
// <Route path='/addStory' component={AddStory} />
// <Route path='/addScene' component={AddScene} />
// <Route path='/stories' component={Stories} />
// <Route path='/login' component={Login} />
// </div>

{ /* <li style={liStyle}><a href='/addScene'>Add Scene</a></li> */ }
