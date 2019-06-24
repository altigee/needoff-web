import React, { useState, useEffect } from 'react';
import { Button, Modal, Spin } from 'antd';
import authService from './../authService/authService';
import InputForm from './../inputForm/InputForm';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import 'antd/dist/antd.css'; 

const focusOnError = createDecorator();

const Dashboard = () => {

  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  // const onSubmit = authService.createWorkspaces;

  const onSubmit = async (data) => {
    await authService.createWorkspaces(data);
    setVisible(false);
  }  

  const createWS = () => {
    return (
      <Modal
          title="Enter your WS"
          visible={visible}
          footer={null}
        >
          <Form 
            onSubmit={onSubmit}
            decorators={[focusOnError]}
            validate={values => {
              const errors = {};
              if (!values.team) {
                errors.team = "Required";
              }
              return errors;
            }}
          >
            {(
              {handleSubmit}) => (
              <form onSubmit={handleSubmit}>
                <div>
                  <Field 
                    name="team"
                    component={InputForm}
                    placeholder="Enter your WS"
                  />
                  <Button type="primary" htmlType="submit">Ok</Button>
                </div>
              </form>
            )}
          </Form>
        </Modal>
    )
  }

  useEffect(() => { 
    (async() => {
      await authService.getMyWorkspaces();
      console.log(loading);
      setLoading(false);
    })();
  }, [loading]);
    
  if (loading) return <Spin />
  const workSpaces = authService.workspaces;
  console.log(workSpaces);
  const amountWS = workSpaces.myWorkspaces.length;
  console.log(amountWS);
    return (
      <>
        { amountWS && createWS()}
        { (amountWS > 5)
          ?
            <div>
              More then 1
            </div>
          :
          <div>1</div>
        }
        <Button 
          onClick={authService.logout}
        >
          Log out
        </Button>
      </>
    )  
}  

export default Dashboard;