import React, {Component} from 'react'
import firebase, {auth} from '~/fire';
import { Switch, Route, NavLink, HashRouter } from 'react-router-dom';
import Routes from './Routes'
import Login from './Login'
import AddScene from './AddScene'
import AddStory from './AddStory'
import Stories from './Stories'

const navStyle = {
    listStyleType: 'none',
    margin: '0',
    padding: '0',
    overflow: 'hidden',
    backgroundColor: 'rgba(251, 202, 43, 1)'
}

const liStyle ={
    float: 'left',
    display: 'block',
    color: 'white',
    textAlign: 'center',
    padding: '14px 16px',
    textDecoration: 'none'
}





export const Navbar = ({user, auth}) =>
<div>
        <div>
            <div>
                <ul className="header navStyle">
                {/* link to home commented out as home component not ready yet */}
                    <li className="liStyle">Home</li>
                    <li className="liStyle"><a href='/stories/new'>Add Stories</a></li>
                    <li className="liStyle"><a href='/stories'>Stories</a></li>
                     {((!user || user.isAnonymous))
                     ? <Login className="liStyle">
                     Login with Google
                       </Login>
                     :
                     <li 
                        className="logout liStyle" 
                        onClick={() => auth.signOut()}>logout
                     </li>
                     }
                    </ul>
            </div>
        </div>
</div>



// <div>
// {/* <Route path='/' component={App} /> */}
// <Route path='/addStory' component={AddStory} />
// <Route path='/addScene' component={AddScene} />
// <Route path='/stories' component={Stories} />
// <Route path='/login' component={Login} />
// </div>

{/* <li style={liStyle}><a href='/addScene'>Add Scene</a></li> */}
