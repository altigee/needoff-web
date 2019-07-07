import React, { Component } from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import AUTH_ROUTES from './auth.routes';
import Login from './login/Login';
import Signup from './signup/Signup';

import './styles.scss';
import 'antd/dist/antd.css'; 

export default class Auth extends Component {

  render() {
    return (
      <Switch>
        <Route path={AUTH_ROUTES.LOGIN} component={Login} />
        <Route path={AUTH_ROUTES.SIGNUP} component={Signup} />
        <Redirect to={AUTH_ROUTES.LOGIN} />
      </Switch>
    );
  }
}  