import React, { useState } from 'react';
import { assign } from 'lodash';
import { Button, Modal } from 'antd';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';

import Loading from './../loading/Loading';
import profileService from './../../services/profileService/profileService';
import history from './../router/history';
import sendNotification from './../notifications/notifications';
import InputForm from './../form/inputForm/InputForm';

import './styles.scss';
import 'antd/dist/antd.css';

const focusOnError = createDecorator();

const WorkspacesList = props => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(!profileService.myWorkspaces.length);
  const [workspaces, setWorkspaces] = useState(profileService.myWorkspaces);

  const onSubmitCreateWs = async data => {
    setLoading(true);
    try {
      const wsId = await profileService.createWorkspaces(data);
      await profileService.fetchMyWorkspaces();
      setWorkspaces(profileService.myWorkspaces);
      localStorage.setItem('currentWs', wsId.createWorkspace.ws.name);
      props.setWsId(wsId.createWorkspace.ws.id);
    } catch (error) {
      sendNotification('error');
    }
    setLoading(false);
    setVisible(false);
    history.push(`/main/workspace`);
  };

  const listWorkspaces = () => {
    const data = workspaces.map(item => assign({}, item, { key: item.id }));
    return (
      <>
        {data.map(item => {
          return (
            <div key={item.id} className="nd-ws-button">
              <Button
                type="link"
                onClick={() => {
                  localStorage.setItem('currentWs', item.name);
                  props.setWsId(profileService.getWs.id);
                  history.push(`/main/workspace`);
                }}
              >
                {item.name}
              </Button>
            </div>
          );
        })}
      </>
    );
  };

  const createWS = () => {
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
              errors.name = 'Required';
            }
            return errors;
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <div>
                  <label>Name</label>
                  <Field name="name" component={InputForm} placeholder="name" />
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
                <Button type="primary" htmlType="submit">
                  Ok
                </Button>
                <Button type="secondary" onClick={() => setVisible(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Form>
      </Modal>
    );
  };

  if (loading) return <Loading />;
  return (
    <>
      <div className="nd-table nd-workspaces-list-wrapper">
        {listWorkspaces()}
        {(visible || !workspaces.length) && createWS()}
        <br />
        <Button type="primary" onClick={() => setVisible(true)}>
          Add Workspace
        </Button>
      </div>
    </>
  );
};

export default WorkspacesList;
