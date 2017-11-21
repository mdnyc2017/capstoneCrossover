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
    constructor(props) {
      super();
      this.state = {
        user: {}
      };
    }
    
  
    componentDidMount() {
      this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
    }
  
    componentWillUnmount() {
      this.unsubscribe()
    }
  
    render() {
      const {user} = this.state || {}
      return (
        <div className="page">
          <nav>
            <Navbar user={user} auth={auth}/>
          </nav>
          <br />
          <span className="navBar-user-name">{welcome(user)}
          </span>
          <Routes user={this.state}/>
        </div>)
    }
  }