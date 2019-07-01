import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Button, Modal} from 'antd';
import profileService from './../../services/profileService/profileService';
import Workspace from './../workspace/Workspace';
import WorkspacesList from './WorkspacesList';
import InputForm from './../form/inputForm/InputForm';
import SelectForm from './../form/selectForm/SelectForm';
import Loading from './../loading/Loading';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import history from './../router/history';

import 'antd/dist/antd.css'; 

const focusOnError = createDecorator();

const Workspaces = () => {

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
    try {
      await profileService.createWorkspaces(data);
    }
    catch(error) {
      throw(error);
    }
    setVisible(false);
    history.push(`/`);
  }

  const onSubmitSelectWs = async (data) => {
    console.log(data);
    localStorage.setItem("currentWs", data.name);
    setVisible(false);
  } 

  const createWs = () => {
    return (
      <Modal
          title="Add your Workspace"
          visible={visible}
          footer={null}
          closable={false}
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

  const selectWs = () => {
    return (
      <>
        <Modal
          title="Choose your WS"
          visible={visible}
          footer={null}
          closable={false}
        >
          <Form 
            onSubmit={onSubmitSelectWs}
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
                  <Button 
                    type="secondary" 
                    onClick={() => setVisible(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </Modal>
      </>
    )
  }

  const toWorkspace = () => {
    return (
      <>
        { !localStorage.getItem("currentWs") && workspaces.length > 1 && selectWs() }
        <Switch>
          <Route path="/main/workspaces/:currentWs" component={Workspace} />
          <Route path="/main/workspaces" component={WorkspacesList} />
        </Switch>
      </>
    )
  }

  if (loading) return <Loading />
    return  !workspaces.length  
      ? createWs() 
      : toWorkspace();
}  

export default Workspaces;