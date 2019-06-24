import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Button, Modal, Spin, Select } from 'antd';
import authService from './../authService/authService';
import profileService from './../profileService/profileService'
import WorkSpace from './WorkSpace/WorkSpace'
import InputForm from './../inputForm/InputForm';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import history from './../router/history';
import 'antd/dist/antd.css'; 

const focusOnError = createDecorator();

const SelectForm = ({ input, options, meta, ...rest }) => (
  <>
    <Select
      {...input}
      {...rest}
      showSearch
    >
      {
        options.map(r =>
          <Select.Option value={r.name} key={r.id}>{r.name}</Select.Option>)
      }
    </Select>  
  </>
)

const Dashboard = (props) => {

  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [amountWS, setAmountWS] = useState(0);
  const [workspaces, setWorkspaces] = useState(null);

  useEffect(() => { 
    (async() => {
      const workspaces = await profileService.getMyWorkspaces();
      setWorkspaces(workspaces);
      console.log(workspaces);
      setAmountWS(workspaces.length);
      setLoading(false);
      if (amountWS === 1) {
        localStorage.setItem("currentWS", profileService.workspaces[0].name);
        history.push(`/dashboard/${localStorage.getItem("currentWS")}`);
      }
    })();
  }, [amountWS, visible]);

  const onSubmit = async (data) => {
    await profileService.createWorkspaces(data);
    setVisible(false);
  }  

  const onSubmitSelectWS = async (data) => {
    console.log(data);
    localStorage.setItem("currentWS", data.team);
    history.push(`/dashboard/${localStorage.getItem("currentWS")}`);
    setVisible(false);
  } 

  const createWS = () => {
    return (
      <Modal
          title="Enter your Team"
          visible={visible}
          footer={null}
      >
        <Form 
          onSubmit={onSubmit}
          decorators={[focusOnError]}
          validate={values => {
            const errors = {};
            if (!values.team) {
              errors.team = "Required";
            }
            return errors;
          }}
        >
          {(
            {handleSubmit}) => (
            <form onSubmit={handleSubmit}>
              <div>
                <Field 
                  name="team"
                  component={InputForm}
                  placeholder="Enter your team"
                />
                <Button type="primary" htmlType="submit">Ok</Button>
              </div>
            </form>
          )}
        </Form>
      </Modal>
    )
  }

  const showDashboard = () => {
    return (
      <>
        { !localStorage.getItem("currentWS") && amountWS > 1 ? selectWS(): showCurrentWS() }
        <Button onClick={authService.logout}>Log out</Button>
      </>
    )
  }

  const selectWS = () => {
    return (
      <>
        <Modal
          title="Choose your Team"
          visible={visible}
          footer={null}
        >
          <Form 
            onSubmit={onSubmitSelectWS}
          >
            {(
              {handleSubmit}) => (
              <form onSubmit={handleSubmit}>
                <div>
                <Field 
                  name="team"
                  component={SelectForm}
                  placeholder="Choose your team"
                  options={workspaces}
                >
                </Field>  
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

  const showCurrentWS = () => {
    return (
      <>
        <Switch>
          <Route path="/dashboard/:currentWS" component={WorkSpace} />
      </Switch>
      </>
    )
  }

  if (loading) return <Spin />
  console.log(amountWS);
  console.log(workspaces);
    return (
      <>
       { !amountWS  ? createWS() : showDashboard()}
      </>
    ) 
}  

export default Dashboard;