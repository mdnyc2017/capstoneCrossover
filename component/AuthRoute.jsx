import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Router } from 'react-router';
import { Redirect } from "react-router";
import firebase, { auth } from "~/fire";

export default function AuthRoute ({component: Component, authed, path, user}) {
    return (
      <Route
        path={path}
        render={(props) => authed.user !== null
          ? <Component currentUser={user} 
          {...props} 
          />
          : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
      />
    )
  }