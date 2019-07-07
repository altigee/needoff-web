import React, { useState} from 'react';
import { assign } from 'lodash';
import { Button, Modal, Table, Divider } from 'antd';
import profileService from './../../services/profileService/profileService';
import Loading from './../loading/Loading';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import history from './../router/history';
import InputForm from './../form/inputForm/InputForm';

import './styles.scss';
import 'antd/dist/antd.css'; 

const focusOnError = createDecorator();

const WorkspacesList = (props) => {

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(!profileService.getMyWorkspaces.length);
  const [workspaces, setWorkspaces] = useState(profileService.getMyWorkspaces);

  const onSubmitCreateWs = async (data) => {
    setLoading(true);
    try {
      const wsId = await profileService.createWorkspaces(data);
      await profileService.fetchMyWorkspaces();
      setWorkspaces(profileService.getMyWorkspaces);
      localStorage.setItem("currentWs", wsId.createWorkspace.ws.name);
      props.setWsId(wsId.createWorkspace.ws.id);
    }
    catch(error) {
      throw(error);
    }
    setLoading(false);
    setVisible(false);
    history.push(`/main/workspace/${localStorage.getItem("currentWs")}/info`);
  }

  const listWorkspaces = () => {
    const data = workspaces.map(item => assign({}, item, {key: item.id}));
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Action',
        key: 'action',
        render: (record) => {
          return (
            <>
              <span>
                <span>
                  <Button 
                    type='link'
                    onClick={() => {
                      localStorage.setItem("currentWs", record.name);
                      props.setWsId(profileService.getWs.id);
                      history.push(`/main/workspace/${localStorage.getItem('currentWs')}/info`);}
                    }
                  >
                    Goto
                  </Button>
                </span>
                  <Divider type="vertical" />
                <span>
                  <Button 
                    type='link' 
                    onClick={() => {
                      console.log('Delete');
                    }}
                  >
                    Delete
                  </Button>
                </span>
              </span>
            </>
        )},
      },
    ];
    return (
      <Table dataSource={data} columns={columns} pagination={false}/>
    )
  }

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
    )
  }

  if (loading) return <Loading />
  return  (
    <>
    <div className="nd-workspaces-list-wrapper">
      { listWorkspaces() }
      { (visible || !workspaces.length) && createWS() }
      <br />
      <Button type='primary' onClick={() => setVisible(true)}>Add Workspace</Button>
    </div>
    </>
  )
}  

export default WorkspacesList;