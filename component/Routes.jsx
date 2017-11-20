import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {Router} from 'react-router';
import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

import Stories from './Stories';
import AddStory from './AddStory';
import SingleStory from './SingleStory';
import AddScene from './AddScene';
import Home from './Home';

const history = process.env.NODE_ENV === 'test' ? createMemoryHistory() : createHistory();

const Routes = (props) => (
   <Router history={history}>
     <Switch>
        <Route exact path='/' render={()=> <Home currentUser={props.user} />} />
        <Route exact path='/stories' render={()=> <Stories currentUser={props.user} />} />
        <Route exact path='/stories/new' render={()=> <AddStory currentUser={props.user} />} />
        <Route exact path='/stories/:id' render={(newProps)=> <SingleStory currentUser={props.user} {...newProps} />} />
        <Route exact path='/stories/:id/addscene' render={(newProps) =><AddScene currentUser={props.user} {...newProps}/>} />
    </Switch>
  </Router>
)

export default Routes;
