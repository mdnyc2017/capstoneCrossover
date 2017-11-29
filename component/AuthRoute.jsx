import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Router } from 'react-router';
import { Redirect } from "react-router";
import firebase, { auth } from "~/fire";

export default function AuthRoute ({component: Component, authed, path}) {
  const user = firebase.auth().currentUser  
  console.log('in authRoute, user is: ', user)
    return (
      <Route
        path={path}
        render={(user) => authed.user !== null
          ? <Component currentUser={user} 
          // {...props} 
          />
          : <Redirect to={{pathname: '/', state: {from: user.location}}} />}
      />
    )
  }