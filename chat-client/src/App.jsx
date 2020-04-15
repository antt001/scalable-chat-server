import React, { useState, useEffect } from 'react';
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Switch, Route } from 'react-router-dom';

import { AuthRoute } from './Auth/AuthRoute';
import { Home } from './Home';
import { LoginForm } from './Auth/LoginForm';
import { RegisterForm } from './Auth/RegisterForm';

import './App.css';

// create our material ui theme using up to date typography variables
const theme = createMuiTheme({
  palette: {
    type: "dark"
  },
  typography: {
    useNextVariants: true
  }
});

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Switch>
          <AuthRoute path="/" component={Home} exact />
          <Route path="/login" component={LoginForm} />
          <Route path="/register" component={RegisterForm} />        
        </Switch>
      </div>
    </ThemeProvider>
  );
};
