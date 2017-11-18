import React, {Component} from 'react'
import firebase, {auth} from '~/fire';
import Routes from './Routes'
import Login from './Login'

export const welcome = user => {
    if (!user) return ''
    if (user.isAnonymous) return ''
    return 'Hello, ' + user.displayName || 'Hello, ' + user.email
  }
  
  export const WhoAmI = ({user, auth}) =>
    <div className="whoami">
      { // If nobody is logged in, or the current user is anonymous,
        (!user || user.isAnonymous)?
        // ...then show signin links...
        <Login />
        /// ...otherwise, show a logout button.
        : <button className='logout' onClick={() => auth.signOut()}>logout</button> }
    </div>
  
  export default class App extends Component {
    state = {};
  
    componentDidMount() {
      this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
    }
  
    componentWillUnmount() {
      this.unsubscribe()
    }
  
    render() {
      const {user} = this.state || {}
      console.log(this.state);
      return (
        <div>
          <nav>
            <WhoAmI user={user} auth={auth}/>
          </nav>
          <span className="whoami-user-name">{welcome(user)}
          </span>
          <Routes user={user}/>
        </div>)
    }
  }