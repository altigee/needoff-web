import React, { useState, useEffect } from 'react';
import { assign } from 'lodash';
import { Button, Modal, Table } from 'antd';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';

import profileService from './../../../services/profileService/profileService';
import DatePickerForm from './../../form/datePickerForm/DatePickerForm';
import InputForm from './../../form/inputForm/InputForm';
import { format } from './../../utils/date';
import sendNotification from './../../notifications/notifications';
import Loading from './../../loading/Loading';

import './../styles.scss';
import 'antd/dist/antd.css';

const focusOnError = createDecorator();

const WorkspaceInvitations = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [currentWs, setCurrentWs] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const currentWs = profileService.currentWs;
        setCurrentWs(currentWs);
        const users = await profileService.getWSMembersInvitations(
          currentWs.id
        );
        setUsers(users.workspaceInvitations);
      } catch (error) {
        sendNotification('error');
      }
      setLoading(false);
    })();
  }, []);

  const onSubmit = async ({ date, email }) => {
    const startdate = format(date);
    setLoading(true);
    try {
      await profileService.addWorkspaceMember(email, currentWs.id, startdate);
      const users = await profileService.getWSMembersInvitations(currentWs.id);
      setUsers(users.workspaceInvitations);
    } catch (error) {
      sendNotification('error');
    }
    setLoading(false);
    setVisible(false);
  };

  const addUser = () => {
    return (
      <>
        <Modal
          className="nd-modal-invitations"
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
                errors.title = 'Required';
              }
              if (!values.date) {
                errors.date = 'Required';
              }
              return errors;
            }}
          >
            {({ handleSubmit }) => (
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
                    <Field name="date" component={DatePickerForm} />
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
      </>
    );
  };

  const removeUser = async user => {
    Modal.confirm({
      title: 'Do you want to delete a user?',
      icon: 'check-circle',
      onOk() {
        (async () => {
          setLoading(true);
          try {
            await profileService.removeWorkspaceMember(
              user.email,
              currentWs.id
            );
            const users = await profileService.getWSMembersInvitations(
              currentWs.id
            );
            setUsers(users.workspaceInvitations);
          } catch (error) {
            sendNotification('error');
          }
          setLoading(false);
        })();
      }
    });
  };

  const listMembers = () => {
    const data = users.map(item =>
      assign(
        {},
        {
          id: item.id,
          key: item.id,
          email: item.email,
          date: item.startDate,
          status: item.status
        }
      )
    );
    const columns = [
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: 'Action',
        key: 'action',
        render: record => (
          <span>
            <Button type="link" onClick={() => removeUser(record)}>
              Delete
            </Button>
          </span>
        )
      }
    ];

    return <Table dataSource={data} columns={columns} pagination={false} />;
  };

  if (loading) return <Loading />;

  return (
    <div className="nd-workspace-invitations-wrapper">
      {visible && addUser()}
      {listMembers()}
      <br />
      <Button type="primary" onClick={() => setVisible(true)}>
        Add User
      </Button>
    </div>
  );
};

export default WorkspaceInvitations;
