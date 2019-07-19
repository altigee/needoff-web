import React, { Component } from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import Auth from './components/auth/Auth';
import MainMenu from './components/mainMenu/MainMenu';
import authService from './services/authService/authService';
import ROOT_ROUTES from './root.routes';

export default class Routes extends Component {
  render() {
    return authService.getToken()
      ? this.renderAuthedRoutes()
      : this.renderUnAuthedRoutes();
  }

  renderAuthedRoutes = () => {
    authService.refreshTokenMock();
    return (
      <Switch>
        <Route path={ROOT_ROUTES.MAIN} component={MainMenu} />
        <Redirect to={ROOT_ROUTES.MAIN} />
      </Switch>
    );
  };

  renderUnAuthedRoutes = () => {
    return (
      <Switch>
        <Route path={ROOT_ROUTES.AUTH} component={Auth} />
        <Redirect to={ROOT_ROUTES.AUTH} />
      </Switch>
    );
  };
}
