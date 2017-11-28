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
  // console.log("Routes", props.user)
  return (
  <Router history={history}>
    <Switch>
      <Route exact path="/" render={() => <Home currentUser={props.user} />} />
      <AuthRoute authed={props.user} exact path="/stories" component={Stories} user={props.user} />
      <AuthRoute authed={props.user} path="/stories/new" component={AddStory} user={props.user} />
      <AuthRoute authed={props.user} exact path="/stories/:id" component={SingleStory} user={props.user} />
      <AuthRoute authed={props.user} exact path="/stories/:id/addscene" component={AddScene} user={props.user} />
      <AuthRoute authed={props.user} exact path="/stories/:id/collaborate" component={AddCollaborator} user={props.user} />
    </Switch>
  </Router>)
};

export default Routes;


// <Route
// exact
// path="/stories"
// render={() => <Stories currentUser={props.user} />}
// />