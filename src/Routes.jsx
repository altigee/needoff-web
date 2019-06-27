import React, { Component } from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import Auth from './components/auth/Auth';
import Dashboard from './components/dashboard/Dashboard';
import MainMenu from './components/mainMenu/MainMenu'
import Calendar from './components/calendar/Calendar';
import authService from './components/auth/authService/authService';

export default class Routes extends Component {
  
  render() {
    return authService.getStatus()
      ? this.renderAuthedRoutes()
      : this.renderUnAuthedRoutes()
  }

  renderAuthedRoutes = () => {
      return (
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/main" component={MainMenu} />
            <Route path="/calendar" component={Calendar} />
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