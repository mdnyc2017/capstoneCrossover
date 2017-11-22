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
        {/* link to home commented out as home component not ready yet */}
        <li className="navbar-li"><a href="/">Home</a></li>
        <li className="navbar-li"><a href="/stories/new">Add Stories</a></li>
        <li className="navbar-li"><a href="/stories">Stories</a></li>
        {((!user || user.isAnonymous))
            ? <li className="navbar-li">
                <Login>
                    Login with Google
                </Login>
            </li>
                
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
