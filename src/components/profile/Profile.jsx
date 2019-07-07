import React, { useState } from 'react';
import { assign } from 'lodash';
import profileService from './../../services/profileService/profileService';
import { Button, Table } from 'antd';
import history from './../router/history';
import InputForm from './../form/inputForm/InputForm';
import Loading from './../loading/Loading';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';

import './styles.scss';
import 'antd/dist/antd.css'; 

const focusOnError = createDecorator();

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const profileInfo = (firstName, lastName, email, phone, position) => {
    const data = [];
    data.push(assign({}, {key: email, firstName, lastName, email, phone, position}));
    const columns = [
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
      },
    ];
    return (
      <div className='nd-profile-wrapper'>
        <Table dataSource={data} columns={columns} pagination={false}/>
        <br />
        <Button type="primary" onClick = {()=> setEdit(true)}>Edit</Button>
      </div> 
    )
  }

  const onUpdateProfile = async(data) => {
    setLoading(true);
    try {
      // await profileService.updateWorkspaceInfo(data, id); query doesn't exist now
    }
    catch(error) {
      throw(error);
    }
    setEdit(false)
    history.push(`/`);
  }


  if (loading) return <Loading />;
  const { firstName, lastName, email, phone, position } = profileService.user;
  return (
    <>
      { !edit && profileInfo(firstName, lastName, email, phone, position) }
      { edit && <div className="nd-profile-wrapper">
        <Form 
          onSubmit={onUpdateProfile}
          decorators={[focusOnError]}
          validate={values => {
            const errors = {};
            if (!values.firstName) {
              errors.firstName = "Required";
            }
            if (!values.lastName) {
              errors.lastName = "Required";
            }
            if (!values.email) {
              errors.email = "Required";
            }
            if (!values.phone) {
              errors.phone = "Required";
            }
            if (!values.position) {
              errors.position = "Required";
            }
            return errors;
          }}
        >
          {(
            {handleSubmit}) => (
            <form onSubmit={handleSubmit}>
              <div>
                <div>
                  <label>First Name</label>
                  <br />
                  <Field 
                    name="firstName"
                    component={InputForm}
                    defaultValue={firstName}
                  />
                  <br />
                </div>
                <br/>
                <div>
                  <label>Last Name</label>
                  <br />
                  <Field 
                    name="lastName"
                    component={InputForm}
                    defaultValue={lastName}
                  />
                  <br />
                </div>
                <div>
                  <label>Email</label>
                  <br />
                  <Field 
                    name="email"
                    component={InputForm}
                    defaultValue={email}
                  />
                  <br />
                </div>
                <br />
                <div>
                  <label>Phone</label>
                  <br />
                  <Field 
                    name="phone"
                    component={InputForm}
                  />
                </div>
                <br />
                <div>
                  <label>Position</label>
                  <br />
                  <Field 
                    name="position"
                    component={InputForm}
                  />
                </div>
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



export default Profile;