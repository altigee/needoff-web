import React, { Component } from 'react';

import { Button } from 'antd';
import InputForm from './../../../components/inputForm/InputForm';
import history from '../../router/history';
import AuthLayout from '../../auth-layout/AuthLayout';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
// import { request } from "graphql-request";
import authService from './../../authService/authService';

import './../styles.scss';
import 'antd/dist/antd.css';

const focusOnError = createDecorator();

export default class Signup extends Component {

  onSubmit = authService.register;

  render() {
    return (
      <AuthLayout>
        <div className="auth-wrap">
          <Form 
            onSubmit={this.onSubmit}
            decorators={[focusOnError]}
            validate={values => {
              const errors = {};
              if (!values.firstName) {
                errors.firstName = "Required";
              }
              if (!values.lastName) {
                errors.lastName = "Required";
              }
              if (!values.login) {
                errors.login = "Required";
              }
              if (!values.password) {
                errors.password = "Required";
              }
              return errors;
            }}
          >
            {(
              {handleSubmit}) => (
              <form onSubmit={handleSubmit}>
                <div className='auth-wrap-input'>
                  <label>First Name</label>
                  <Field 
                    name="firstName"
                    component={InputForm}
                    placeholder="Enter your First Name"
                  />
                </div>
                <div className='auth-wrap-input'>
                  <label>Last Name</label>
                  <Field 
                    name="lastName"
                    component={InputForm}
                    placeholder="Enter your Last Name"
                  />
                </div>
                <div className='auth-wrap-input'>
                  <label>Login</label>
                  <Field 
                    name="login"
                    component={InputForm}
                    placeholder="login"
                  />
                </div>
                <div className='auth-wrap-input'>
                  <label>Password</label>
                  <Field 
                    name="password"
                    component={InputForm}
                    placeholder="password"
                  />  
                </div>
                <div className="auth-wrap-button">
                  <Button htmlType="submit">Sign up</Button>
                  <Button 
                    type="link"
                    onClick={() => history.push('/auth/login')}
                  >
                    Log in
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