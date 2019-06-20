import React, { Component } from 'react';

import { Input, Button } from 'antd';
import history from '../../router/history';
import AuthLayout from '../../auth-layout/AuthLayout';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { request } from "graphql-request";

import './../styles.scss';
import 'antd/dist/antd.css';

/*
const query = `
  query {
    Lift(id: "panorama") {
      name
      status
    }
  }
`;

request("https://snowtooth.moonhighway.com/graphql", query)
  .then(console.log)
  .catch(console.error);
 */ 

var query = `mutation {
  login(email: "okyrienko@gmail.com", password:"12345") {
    accessToken
    refreshToken
  }
}`;

// const url = "http://nmarchuk.pythonanywhere.com/graphql";
request("http://nmarchuk.pythonanywhere.com/graphql", query)
  .then(console.log)
  .catch(console.error);


const focusOnError = createDecorator();

const InputForm = ({ input, meta, ...rest }) => (
  <>
    <Input
      {...input}
      {...rest}
    />
    <div className='auth-error-text'>
      {meta.error && meta.touched && <span>{meta.error}</span>}
    </div>
  </>
)

export default class Signup extends Component {

  onSubmit = (values) => {
    console.log('OnSubmit');
    alert(values);
    return;
  }

  handleSubmit = async () => {
    console.log('submit');
    /*  const [err] = await 
      if (!err) {
        history.push('/auth/login');
      }
      */
    }

  render() {
    return (
      <AuthLayout>
        <div className="auth-wrap">
          <Form 
            onSubmit={this.handleSubmit}
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
                    placeholder="Enter your login"
                  />
                </div>
                <div className='auth-wrap-input'>
                  <label>Password</label>
                  <Field 
                    name="password"
                    component={InputForm}
                    placeholder="Enter your password"
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