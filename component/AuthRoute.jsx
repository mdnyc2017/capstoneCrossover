import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Router } from 'react-router';
import { Redirect } from "react-router";

export default function AuthRoute ({component: Component, authed, user, path}) {
    console.log("auth", user)
    return (
      <Route
        path={path}
        render={(props) => authed.user !== null
          ? <Component currentUser={user} {...props} />
          : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
      />
    )
  }