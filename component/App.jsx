import React, {Component} from 'react'
import firebase, {auth} from '~/fire';
import { Switch, Route } from 'react-router-dom';
import Routes from './Routes'
import Login from './Login'
import {Navbar} from './Navbar'



export const welcome = user => {
    if (!user) return ''
    if (user.isAnonymous) return ''
    return 'Hello, ' + user.displayName || 'Hello, ' + user.email
  }
  
  


  export default class App extends Component {
    state = {
      user: {} //always define what will be on state.
    }
  
    componentDidMount() {
      this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
    }
  
    componentWillUnmount() {
      this.unsubscribe()
    }
  
    render() {
      const {user} = this.state
      return (
        //naming conventions for dom elements. 
        //className = 'navbar'
        //descendent = 'navbar-username'
        //important to standardize naming conventions to descendent extensions.
        <div className="navbar">
          <nav className="navbar-nav">
            <Navbar user={user} auth={auth}/>
          </nav>
          <br />
          <span className="navBar-user-name">{welcome(user)}
          </span>
          <Routes user={this.state}/>
        </div>)
    }
  }