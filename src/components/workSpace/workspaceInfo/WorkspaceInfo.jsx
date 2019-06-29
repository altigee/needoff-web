import React, { useState, useEffect } from 'react';
import profileService from './../../../services/profileService/profileService';
import { Button } from 'antd';
import history from './../../router/history';
import InputForm from './../../form/inputForm/InputForm';
import TextAreaForm from './../../form/inputTextArea/InputTextArea';
import Loading from './../../loading/Loading';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';

import './../styles.scss';
import 'antd/dist/antd.css'; 

const focusOnError = createDecorator();

const WorkspaceInfo = (props) => {

  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    (async() => {
      const userInfo = await profileService.getUserInfo();
      console.log(userInfo);
      setUserInfo(userInfo);
      setLoading(false);
    })();
  },[]);

  const onUpdateWorkspace = async(data) => {
    console.log(data);
    try {
      setLoading(true);
      await profileService.updateWorkspaceInfo(data, currentWs.id);
      localStorage.setItem("currentWs", data.name);
      await profileService.fetchMyWorkspaces();
      setLoading(false);
      history.push(`/`);
    }
    catch(error) {
      console.log(error);
      setLoading(false);
    }
  }

  // const workspaces = profileService.getMyWorkspaces;
  if (loading) return <Loading />;
  // console.log(workspaces)
  const currentWs = profileService.getWs;
  console.log(currentWs);
  const { firstName, lastName, email } = userInfo.profile;
  return (
    <>
      <div className="nd-workspace-info-owner">
        <span><strong>Owner: </strong></span>
        <span>  {firstName} {lastName} ({email})</span>
      </div>
      <div className="nd-workspace-info-wrapper">
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
                    defaultValue={currentWs.name}
                  />
                  <br />
                </div>
                <div>
                  <label>Description</label>
                  <br />
                  <Field 
                    name="description"
                    component={TextAreaForm}
                    defaultValue={currentWs.description}
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
                    onClick={() => history.push(`/main/workspaces/${localStorage.getItem("currentWs")}/info`)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Form>
      </div>
    </>
  )
}

export default WorkspaceInfo;