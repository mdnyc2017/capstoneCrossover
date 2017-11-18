import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {Router} from 'react-router';
import Stories from './Stories';
import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

const history = process.env.NODE_ENV === 'test' ? createMemoryHistory() : createHistory();

const Routes = (props) => (
   <Router history={history}>
     <Switch>
        <Route exact path='/stories' render={()=> <Stories currentUser={props.user} />} />
    </Switch>
  </Router>
)

export default Routes;
