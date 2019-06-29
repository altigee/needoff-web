import React, { Component } from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import Auth from './components/auth/Auth';
import MainMenu from './components/mainMenu/MainMenu'
import authService from './services/authService/authService';

export default class Routes extends Component {
  
  render() {
    return authService.getStatus()
      ? this.renderAuthedRoutes()
      : this.renderUnAuthedRoutes()
  }

  renderAuthedRoutes = () => {
      return (
          <Switch>
            <Route path="/main" component={MainMenu} />
            <Redirect to="/main" />
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