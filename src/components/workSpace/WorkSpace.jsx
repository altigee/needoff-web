import React, { useState, useEffect } from 'react';
import { find, assign } from 'lodash';
import profileService from './../profileService/profileService';
import { Spin, Button, Modal, Table } from 'antd';
import DatePickerForm from './../datePickerForm/DatePickerForm';
import CheckboxForm from './../checkboxForm/CheckboxFom';
import InputForm from './../inputForm/InputForm';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';

import 'antd/dist/antd.css'; 

const focusOnError = createDecorator();

const Workspace = (props) => {
  console.log(props.ws);
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState(null);
  const [visibleAddHoliday, setVisibleAddHoliday] = useState(false);
  const [visibleAddUser, setVisibleAddUser] = useState(false);
  const [holidays, setHolidays] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    (async() => {
      try {
        const leaves = await profileService.getMyLeaves(props.ws.id);
        const workspaces = await profileService.getMyWorkspaces();
        
        console.log(workspaces);
        const id = find(workspaces, { 'name': localStorage.getItem("currentWS") }).id;
        const holidayDays = await profileService.getHolidayData(id);
        setHolidays(holidayDays.workspaceDates);
        const users = (await profileService.getWSMembers(id)).workspaceMembers;
        setUsers(users);
        console.log(users);
        setLeaves(leaves.myLeaves);
      } catch (error) {
        
      };
      setLoading(false);
    })();
  },[props.ws.id]);

  const onSubmit = async (data) => {
    await profileService.addHoliday(data, props.ws.id);
    console.log(data);
    setVisibleAddHoliday(false);
    const holidayDays = await profileService.getHolidayData(props.ws.id);
    setHolidays(holidayDays.workspaceDates);
  }

  const onSubmitUser = async (data) => {
    await profileService.addHoliday(data, props.ws.id);
    console.log(data);
    setVisibleAddHoliday(false);
    const holidayDays = await profileService.getHolidayData(props.ws.id);
    setHolidays(holidayDays.workspaceDates);
  }

  const addHoliday = () => {
    return (
      <>
        <Modal
          title="Add Holiday Date"
          visible={visibleAddHoliday}
          footer={null}
        >
        <Form 
          onSubmit={onSubmit}
          decorators={[focusOnError]}
          validate={values => {
            const errors = {};
            if (!values.title) {
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
                  <label>Title</label>
                  <Field 
                    name="title"
                    component={InputForm}
                    placeholder="Title"
                  />
                  <br />
                </div>
                <div>
                  <label>Enter Date</label> <br />
                  <Field 
                    name="date"
                    component={DatePickerForm}
                  />
                </div> 
                <br />
                <div>
                  <Field 
                    name="officialHoliday"
                    component={CheckboxForm}
                    type="checkbox"
                    defaultValue={false}
                  />
                  <label>Official Holiday</label>
                  <br />
                </div> 
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

  const addUser = () => {
    return (
      <>
        <Modal
          title="Add User"
          visible={visibleAddUser}
          footer={null}
        >
        <Form 
          onSubmit={onSubmitUser}
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
              </div>
            </form>
          )}
        </Form>
      </Modal>
      </>
    )  
  }

  const removeHoliday = async (row) => {
    console.log(row);
    await profileService.removeHoliday(row.id);
    const holidayDays = await profileService.getHolidayData(props.ws.id);
    setHolidays(holidayDays.workspaceDates);
  }

  const listHoliday = () => {
    const data = holidays.map(item => assign({}, item, {key: item.id}));
    console.log(data);
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Type',
        key: 'isOfficialHoliday',
        render: (record) => (
          <span>
            {record.isOfficialHoliday ? 'Public Holiday' : 'Workday'}
          </span>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        render: (record) => (
          <span>
            <Button type='link' onClick={() => removeHoliday(record)}>Delete</Button>
          </span>
        ),
      },
    ];
    return (
      <Table dataSource={data} columns={columns} pagination={false}/>
    )
  }

  const listMembers = () => {
    const data = users.map(
      item => assign({}, {key: item.userId, email: item.profile.email, date: item.startDate})
    );
    console.log(data);
    const columns = [
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Start Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Action',
        key: 'action',
        render: (record) => (
          <span>
            <Button type='link' onClick={() => removeHoliday(record)}>Delete</Button>
          </span>
        ),
      },
    ];
    return (
      <Table dataSource={data} columns={columns} pagination={false}/>
    )
  }

  if (loading) return <Spin />
  return (
    <>
      <div>Team: {props.ws.name}</div>
      <div>Descriptin: {props.ws.description}</div>
      <div>Leaves: {leaves}</div>
      <Button onClick={() => setVisibleAddHoliday(true)}>Add Holiday</Button>
      <Button onClick={() => setVisibleAddUser(true)}>Add User</Button>
      { addHoliday()}
      { listHoliday()}
      <br />
      { listMembers()}
      <br />
    </>
  )
}

export default Workspace;