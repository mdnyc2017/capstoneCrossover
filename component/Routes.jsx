import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Router } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import { auth } from '~/fire';
import Stories from './Stories';
import AddStory from './AddStory';
import SingleStory from './SingleStory';
import AddScene from './AddScene';
import AddCollaborator from './AddCollaborator';
import Home from './Home';
import AuthRoute from './AuthRoute';

const history = createHistory();

const Routes = props => {
  return (
  
  <Router history={history}>
  
    <Switch>
      <Route exact path="/" render={() => <Home currentUser={props} />} />
      <AuthRoute authed={props} exact path="/stories" component={Stories} userProps={props} />
      <AuthRoute authed={props} path="/stories/new" component={AddStory} userProps={props} />
      <AuthRoute authed={props} exact path="/stories/:id" component={SingleStory} userProps={props} />
      <AuthRoute authed={props} exact path="/stories/:id/addscene" component={AddScene} userProps={props} />
      <AuthRoute authed={props} exact path="/stories/:id/collaborate" component={AddCollaborator} user={props} />
    </Switch>
  
  </Router>)
};

export default Routes;


// <Route
// exact
// path="/stories"
// render={() => <Stories currentUser={props.user} />}
// />