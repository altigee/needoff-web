import React, { useState } from 'react';
import { assign } from 'lodash';
import profileService from './../../../services/profileService/profileService';
import { Button, Table } from 'antd';
import history from './../../router/history';
import InputForm from './../../form/inputForm/InputForm';
import TextAreaForm from './../../form/inputTextArea/InputTextArea';
import Loading from './../../loading/Loading';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';

import './../styles.scss';
import 'antd/dist/antd.css'; 

const focusOnError = createDecorator();

const WorkspaceInfo = () => {

  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const wsInfo = (name, description, paid, unpaid, sick) => {
    const data = [];
    data.push(assign({}, {key: name, name, description, paid, unpaid, sick}));
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
        title: 'Paid vacation days per year',
        dataIndex: 'paid',
        key: 'paid',
      },
      {
        title: 'Unpaid vacation days per year',
        dataIndex: 'unpaid',
        key: 'unpaid',
      },
      {
        title: 'Sick leaves',
        dataIndex: 'sick',
        key: 'sick',
      },
    ];  
    return (
      <div className='nd-workspace-info-wrapper'>
        <Table dataSource={data} columns={columns} pagination={false}/>
        <br />
        <Button type="primary" onClick = {()=> setEdit(true)}>Edit</Button>
      </div> 
    )
  }

  const onUpdateWorkspace = async(data) => {
    setLoading(true);
    try {
      await profileService.updateWorkspaceInfo(data, id);
      localStorage.setItem("currentWs", data.name);
      await profileService.fetchMyWorkspaces();
    }
    catch(error) {
      throw(error);
    }
    setEdit(false);
    setLoading(false);
    const currentWs = localStorage.getItem("currentWs");
    history.push(`/main/workspace/${currentWs}/info`);
  }

  if (loading) return <Loading />;
  const { name, description, id } = profileService.getWs;
  const { firstName, lastName, email } = profileService.user;
  return (
    <>
      <div className="nd-workspace-info-owner">
        <label><strong>Owner: </strong></label>
        <span>  {firstName} {lastName} ({email})</span>
      </div>
      { !edit && wsInfo(name, description, 0, 0, 0) }
      { edit && <div className="nd-workspace-info-wrapper">
        <Form 
          onSubmit={onUpdateWorkspace}
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
                  <br />
                  <Field 
                    name="name"
                    component={InputForm}
                    defaultValue={name}
                  />
                  <br />
                </div>
                <div>
                  <label>Description</label>
                  <br />
                  <Field 
                    name="description"
                    component={TextAreaForm}
                    defaultValue={description}
                    rows={3}
                  />
                </div>
                <br/> <br /> <br />
                <div>
                  <label>Paid vacation days per year</label>
                  <br />
                  <Field 
                    name="paidDays"
                    component={InputForm}
                    defaultValue={0}
                  />
                  <br />
                </div>
                <div>
                  <label>Unpaid vacation days per year</label>
                  <br />
                  <Field 
                    name="unpaidDays"
                    component={InputForm}
                    defaultValue={0}
                  />
                </div>
                <br />
                <div>
                  <label>Sick leaves per year</label>
                  <br />
                  <Field 
                    name="sickDays"
                    component={InputForm}
                    defaultValue={0}
                  />
                </div>
                <br />
                <br />
                <div className='nd-workspace-info-footer'>
                  <Button type="primary" htmlType="submit">Update</Button>
                  <Button 
                    type="secondary" 
                    onClick={() => setEdit(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Form>
      </div>}
    </>
  )
}

export default WorkspaceInfo;