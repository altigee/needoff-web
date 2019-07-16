import React, { useState } from 'react';
import { Button, Avatar, Card } from 'antd';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import profileService from './../../services/profileService/profileService';
import history from './../router/history';
import InputForm from './../form/inputForm/InputForm';
import Loading from './../loading/Loading';
import sendNotification from './../notifications/notifications';
import MAIN_ROUTES from './../mainMenu/main.routes';

import './styles.scss';
import 'antd/dist/antd.css';

const { Meta } = Card;

const focusOnError = createDecorator();

const urlUser1 = '';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const profileInfo = ({ firstName, lastName, email, phone, position }) => {
    phone = '38(093)1111111';
    position = 'Front-End Software Developer';
    return (
      <div className="nd-table nd-profile-wrapper">
        <Card loading={loading} bordered={false}>
          <Meta
            avatar={
              <Avatar
                shape="square"
                src={urlUser1}
                icon="user"
                size={120}
                style={{ marginRight: '32px' }}
              />
            }
            title={`${firstName} ${lastName}`}
            description={`${position}`}
          />
          <br /> <br />
          <div className="profile-details">
            <div>
              {`Email: `}
              {email}
            </div>
            <div>
              {`Phone: `}
              {phone}
            </div>
          </div>
        </Card>
        <br />
        <Button type="primary" onClick={() => setEdit(true)}>
          Edit
        </Button>
      </div>
    );
  };

  const onUpdateProfile = async data => {
    setLoading(true);
    try {
      // await profileService.updateWorkspaceInfo(data, id); query doesn't exist now
    } catch (error) {
      sendNotification('error');
    }
    setEdit(false);
    history.push(MAIN_ROUTES.PROFILE);
  };

  if (loading) return <Loading />;
  const { firstName, lastName, email, phone, position } = profileService.user;
  console.log(profileService.currentWs);
  return (
    <>
      {!edit && profileInfo(profileService.user)}
      {edit && (
        <div className="nd-profile-wrapper">
          <Form
            onSubmit={onUpdateProfile}
            decorators={[focusOnError]}
            validate={values => {
              const errors = {};
              if (!values.firstName) {
                errors.firstName = 'Required';
              }
              if (!values.lastName) {
                errors.lastName = 'Required';
              }
              if (!values.email) {
                errors.email = 'Required';
              }
              return errors;
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="form-data-wrapper">
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
                      defaultValue={phone}
                    />
                  </div>
                  <br />
                  <div>
                    <label>Position</label>
                    <br />
                    <Field
                      name="position"
                      component={InputForm}
                      defaultValue={position}
                    />
                  </div>
                  <br />
                  <div className="nd-workspace-info-footer">
                    <Button type="primary" htmlType="submit">
                      Update
                    </Button>
                    <Button type="secondary" onClick={() => setEdit(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Form>
        </div>
      )}
    </>
  );
};

export default Profile;
