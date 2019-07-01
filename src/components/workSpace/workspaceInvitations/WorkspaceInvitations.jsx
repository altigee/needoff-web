import React, { useState, useEffect } from 'react';
import { assign } from 'lodash';
import profileService from './../../../services/profileService/profileService';
import { Button, Modal, Table } from 'antd';
import DatePickerForm from './../../form/datePickerForm/DatePickerForm';
import InputForm from './../../form/inputForm/InputForm';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import Loading from './../../loading/Loading';

import './../styles.scss';
import 'antd/dist/antd.css'; 

const focusOnError = createDecorator();

const WorkspaceInvitations = () => {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [currentWs, setCurrentWs] = useState(null);
  
  useEffect (() => {
    (async() => {
      try {
        const currentWs = profileService.getWs;
        setCurrentWs(currentWs);
        const users = await profileService.getWSMembersInvitations(currentWs.id);
        console.log(users.workspaceInvitations);
        setUsers(users.workspaceInvitations);
      }
      catch(error) {
        throw(error);
      }
      setLoading(false);
    })();
  },[loading]);

  const onSubmit = async (data) => {
    const startdate = data.date.format('YYYY-MM-DD');
    setLoading(true);
    try {
      await profileService.addWorkspaceMember(data.email, currentWs.id, startdate);
    }
    catch(error) {
      throw(error);
    }
    setVisible(false);
  }

  const addUser = () => {
    return (
      <>
        <Modal
          title="Add User"
          visible={visible}
          footer={null}
          closable={false}
        >
        <Form 
          onSubmit={onSubmit}
          decorators={[focusOnError]}
          validate={values => {
            const errors = {};
            if (!values.email) {
              errors.title = "Required";
            }
            if (!values.date) {
              errors.date = "Required";
            }
            return errors;
          }}
        >
          {(
            {handleSubmit}) => (
            <form onSubmit={handleSubmit}>
              <div>
                <div>
                  <label>Email</label>
                  <Field 
                    name="email"
                    component={InputForm}
                    placeholder="Email"
                  />
                  <br />
                </div>
                <div>
                  <label>First Date</label> <br />
                  <Field 
                    name="date"
                    component={DatePickerForm}
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
      </>
    )  
  }

  const removeUser = async (record) => {
    try {
      await profileService.removeWorkspaceMember(record.email, currentWs.id);
    }
    catch(error) {
      throw(error);
    }
    setLoading(true);
  }

  const listMembers = () => {
    // console.log(users);
    const data = users.map(
      item => assign(
        {},
        {
          id: item.id, 
          key: item.id,
          email: item.email,
          date: item.startDate,
          status: item.status,
        }),
    );
    const columns = [
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
          },
          {
            title: 'Action',
            key: 'action',
            render: (record) => (
              <span>
                <Button type='link' onClick={() => removeUser(record)}>Delete</Button>
              </span>
            ),
          },
        ];

    return (
      <Table dataSource={data} columns={columns} pagination={false}/>
    )
  }

  if (loading) return <Loading />

  return (
    <div className="nd-workspace-invitations-wrapper">
      { visible && addUser() }
      { listMembers() }
       <br />
      <Button type='primary' onClick={() => setVisible(true)}>Add User</Button>
    </div>
  )
}

export default WorkspaceInvitations;
