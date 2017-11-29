import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Router } from 'react-router';
import { Redirect } from "react-router";
import firebase, { auth } from "~/fire";

export default function AuthRoute ({component: Component, authed, path, userProps}) {
  // const user = firebase.auth().currentUser  
  console.log('in authRoute, user is: ', userProps)
    return (
      <Route
        path={path}
        render={(user) => authed.user !== null
          ? <Component currentUser={userProps} 
          // {...props} 
          />
          : <Redirect to={{pathname: '/', state: {from: user.location}}} />}
      />
    )
  }