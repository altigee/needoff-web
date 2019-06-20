import React, { Component } from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import Auth from './components/auth/Auth';
import Dashboard from './components/dashboard/Dashboard';

export default class Routes extends Component {
  render() {
      return (
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/dashboard" component={Dashboard} />
            <Redirect to="/auth" />
          </Switch>
      );
    }  
  }