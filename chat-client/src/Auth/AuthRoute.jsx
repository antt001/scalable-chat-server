import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { getSession } from "../lib/auth";

export const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => getSession()
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}
