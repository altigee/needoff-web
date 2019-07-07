import React, { useState, useEffect } from 'react';
import { assign } from 'lodash';
import profileService from './../../../services/profileService/profileService';
import { Button, Modal, Table, Divider } from 'antd';
import DatePickerForm from './../../form/datePickerForm/DatePickerForm';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { format } from './../../utils/date';
import Loading from './../../loading/Loading';

import './../styles.scss';
import 'antd/dist/antd.css'; 

const focusOnError = createDecorator();

const WorkspaceMembers = () => {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect (() => {
    (async() => {
      try {
        // const users = await profileService.getWSMembers(profileService.getWs.id);
        const users = await profileService.getWSMembers(profileService.getWs.id);
        setUsers(users.workspaceMembers);
      }
      catch(error) {
        throw(error);
      }
      setLoading(false);
    })();
  },[]);

  const onSubmitStartDate = async ({date}) => {
    const startdate = format(date);
    setLoading(true);
    try {
      await profileService.updateStartDate(profileService.getWs.id, currentRecord.id, startdate);
      const users = await profileService.getWSMembers(profileService.getWs.id);
      setUsers(users.workspaceMembers);
    }
    catch(error) {
      throw(error);
    }
    setLoading(false);
    setVisible(false);
  }

  const updateStartDate = () => {
    return (
      <>
        <Modal
          title="Set start date"
          visible={visible}
          footer={null}
          closable={false}
        >
        <Form 
          onSubmit={onSubmitStartDate}
          decorators={[focusOnError]}
          validate={values => {
            const errors = {};
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
                  <label>Date</label> <br />
                  <Field 
                    name="date"
                    component={DatePickerForm}
                  />
                </div> 
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
      await profileService.removeWorkspaceMember(record.email, profileService.getWs.id);
    }
    catch(error) {
      throw(error);
    }
    setLoading(true);
  }

  const listMembers = () => {
    const data = users.map(
      item => assign(
        {},
        {
          id: item.userId, 
          key: item.userId,
          email: item.profile.email,
          date: item.startDate,
          name: `${item.profile.firstName} ${item.profile.lastName}`,
        }),
    );
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Start Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Action',
        key: 'action',
        render: (record) => {
          console.log(profileService.owner);
          return (
            <>
              <span>
                <span>
                  <Button 
                    type='link'
                    onClick={() => {
                      setCurrentRecord(record);
                      setVisible(true)}
                    }
                  >
                    Set start date
                  </Button>
                </span>
                  <Divider type="vertical" />
                <span>
                {record.id !== profileService.owner.userId && <Button type='link' onClick={() => removeUser(record)}>Delete</Button>}
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

  if (loading) return <Loading />
  return (
    <div className="nd-workspace-invitations-wrapper">
      { visible && updateStartDate() }
      { listMembers() }
       <br />
    </div>
  )
}

export default WorkspaceMembers;
