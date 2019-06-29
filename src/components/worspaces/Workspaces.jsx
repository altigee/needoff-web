import React, { useState, useEffect } from 'react';
import { find } from 'lodash';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Button, Modal} from 'antd';
import profileService from './../../services/profileService/profileService';
import Workspace from './../workspace/Workspace';
import InputForm from './../form/inputForm/InputForm';
import SelectForm from './../form/selectForm/SelectForm';
import Loading from './../loading/Loading';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import history from './../router/history';

import 'antd/dist/antd.css'; 

const focusOnError = createDecorator();

const Workspaces = (props) => {

  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [workspaces, setWorkspaces] = useState(null);

  useEffect(() => { 
      const workspaces = profileService.getMyWorkspaces;
      setWorkspaces(workspaces);
      const lsCurrentWs = localStorage.getItem("currentWs");
      if (localStorage.getItem("currentWs")) {
        history.push(`/main/workspaces/${lsCurrentWs}`);
      }
      if (workspaces.length === 1) {
        localStorage.setItem("currentWs", workspaces[0].name);

        history.push(`/main/workspaces/${lsCurrentWs}`);
      }
      setLoading(false);
  }, [visible,loading]);

  const onSubmitCreateWs = async (data) => {
    await profileService.createWorkspaces(data);
    await profileService.fetchMyWorkspaces();
    setVisible(false);
    history.push(`/`);
  }

  const onSubmitSelectWS = async (data) => {
    console.log(data);
    localStorage.setItem("currentWs", data.name);
    setVisible(false);
  } 

  const createWS = () => {
    return (
      <Modal
          title="Add your Workspace"
          visible={visible}
          footer={null}
      >
        <Form 
          onSubmit={onSubmitCreateWs}
          decorators={[focusOnError]}
          validate={values => {
            const errors = {};
            if (!values.name) {
              errors.name = "Required";
            }
            return errors;
          }}
        >
          {(
            {handleSubmit}) => (
            <form onSubmit={handleSubmit}>
              <div>
                <div>
                  <label>Name</label>
                  <Field 
                    name="name"
                    component={InputForm}
                    placeholder="name"
                  />
                  <br />
                </div>
                <div>
                  <label>Description</label>
                  <Field 
                    name="description"
                    component={InputForm}
                    placeholder="description"
                  />
                </div>  
                <br />
                <br />
                <Button type="primary" htmlType="submit">Ok</Button>
              </div>
            </form>
          )}
        </Form>
      </Modal>
    )
  }

  const selectWS = () => {
    return (
      <>
        <Modal
          title="Choose your WS"
          visible={visible}
          footer={null}
        >
          <Form 
            onSubmit={onSubmitSelectWS}
            decorators={[focusOnError]}
            validate={values => {
              const errors = {};
              if (!values.name) {
                errors.name = "Required";
              }
              return errors;
            }}
          >
            {(
              {handleSubmit}) => (
              <form onSubmit={handleSubmit}>
                <div>
                <Field 
                  name="name"
                  component={SelectForm}
                  placeholder="Choose your team"
                  options={workspaces}
                >
                </Field>  
                  <br />
                  <br />
                  <Button type="primary" htmlType="submit">Ok</Button>
                </div>
              </form>
            )}
          </Form>
        </Modal>
      </>
    )
  }

  const toWorkspace = () => {
    console.log(history)
    return (
      <>
        { !localStorage.getItem("currentWs") && workspaces.length > 1 && selectWS() }
        <Switch>
          <Route path="/main/workspaces/:currentWs" component={Workspace} />
        </Switch>
      </>
    )
  }

  if (loading) return <Loading />
    return  !workspaces.length  
      ? createWS() 
      : toWorkspace();
}  

export default Workspaces;