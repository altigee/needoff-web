import React, { Component } from 'react';

import { Input, Button } from 'antd';

import AuthLayout from '../../auth-layout/AuthLayout';
import history from '../../router/history';
import { Form, Field } from 'react-final-form';

import './../styles.scss';
import 'antd/dist/antd.css'; 

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

export default class Login extends Component {

  onSubmit = async () => {

  }

  render() {
    return (
      <AuthLayout>
        <div className="auth-wrap">
          <Form 
            onSubmit={this.onSubmit}
            validate={values => {
              const errors = {};
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
                  <Button htmlType="submit">Log in</Button>
                  <Button 
                    type="link"
                    onClick={() => history.push('/auth/signup')}
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