import React, { Component } from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';

import Login from './login/Login';
import Signup from './signup/Signup';

import './styles.scss';
import 'antd/dist/antd.css'; 

export default class Auth extends Component {

  render() {
    return (
      <Switch>
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/signup" component={Signup} />
        <Redirect to="/auth/login" />
      </Switch>
    );
  }
}  