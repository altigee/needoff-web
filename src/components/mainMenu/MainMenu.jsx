import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import history from './../router/history';
import { Route, Redirect, Switch } from 'react-router-dom';
import authService from './../../services/authService/authService';
import profileService from './../../services/profileService/profileService';
import Loading from './../loading/Loading'
import Workspaces from './../worspaces/Workspaces';
import Calendar from './../calendar/Calendar';

import './styles.scss';

const MainMenu = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async() => {
      try {
        await profileService.fetchMyWorkspaces();
      }
      catch(error) {
        throw(error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loading />
  console.log('MainMenu');
  return (
    <>
      <div className="nd-main-wrapper">
        <Button type="link"  onClick={() => history.push('/main/profile')}>Profile</Button>
        <Button type="link"  onClick={() => history.push('/main/leaves')}>Leaves</Button>
        <Button type="link"  onClick={() => history.push(`/main/workspaces`)}>Workspaces</Button>
        <Button type="link"  onClick={() => history.push('/main/calendar')}>Team Calendar</Button>
        <Button type="link"  onClick={() => history.push('/main/todo')}>Todo</Button>
        <Button type="link"  onClick={() => authService.logout()}>Log out</Button>
      </div>
        <Switch>
          <Route path="/main/workspaces" component={Workspaces} />
          <Route path="/main/calendar" component={Calendar} />
          <Redirect to="/main/workspaces" />
        </Switch>
   </>
  )
}

export default MainMenu;