import React, { Component } from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import Auth from './components/auth/Auth';
import Dashboard from './components/dashboard/Dashboard';
import authService from './components/authService/authService';

export default class Routes extends Component {
  
  render() {
    // console.log(authService.getStatus());
    return authService.getStatus()
      ? this.renderAuthedRoutes()
      : this.renderUnAuthedRoutes()
  }

  renderAuthedRoutes = () => {
      return (
          <Switch>
            <Route exact path="/dashboard" component={Dashboard} />
            <Redirect to="/dashboard" />
          </Switch>
      );
    }

  renderUnAuthedRoutes = () => {
    return (
        <Switch>
          <Route path="/auth" component={Auth} />
          <Redirect to="/auth" />
        </Switch>
    );
  }  
}