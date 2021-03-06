import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { Button } from 'antd';

import InputForm from './../../form/inputForm/InputForm';
import AuthLayout from '../../auth/authLayout/AuthLayout';
import history from '../../router/history';
import authService from './../../../services/authService/authService';
import AUTH_ROUTES from './../auth.routes';

import './../styles.scss';
import 'antd/dist/antd.css';

const focusOnError = createDecorator();

export default class Login extends Component {
  onSubmit = authService.login;

  render() {
    return (
      <AuthLayout>
        <div className="auth-wrap auth-wrap-login">
          <Form
            onSubmit={this.onSubmit}
            decorators={[focusOnError]}
            validate={values => {
              const errors = {};
              if (!values.login) {
                errors.login = 'Required';
              }
              if (!values.password) {
                errors.password = 'Required';
              }
              return errors;
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="auth-wrap-input">
                  <label>Login</label>
                  <Field
                    name="login"
                    component={InputForm}
                    placeholder="Enter your login"
                  />
                </div>
                <div className="auth-wrap-input">
                  <label>Password</label>
                  <Field
                    name="password"
                    component={InputForm}
                    type="password"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="auth-wrap-button">
                  <Button htmlType="submit">Log in</Button>
                  <Button
                    type="link"
                    onClick={() => history.push(AUTH_ROUTES.SIGNUP)}
                  >
                    Sign up
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </div>
      </AuthLayout>
    );
  }
}
