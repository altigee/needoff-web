import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'antd';
import history from './../router/history';
import { Route, Redirect, Switch } from 'react-router-dom';
import authService from './../../services/authService/authService';
import profileService from './../../services/profileService/profileService';
import Loading from './../loading/Loading'
import Workspaces from './../worspaces/Workspaces';
import Calendar from './../calendar/Calendar';

import './styles.scss';

// export const WorkspacesContext = React.createContext();

const MainMenu = () => {

  const [workspaces, setWorkspaces] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    (async() => {
      const workspaces = await profileService.fetchMyWorkspaces();
      setWorkspaces(workspaces);
      setLoading(false);
    })();
  }, [loading]);


  console.log('MainMenu', workspaces);
  if (loading) return <Loading />
  return (
    <>
      <div className="nd-main-wrapper">
        <Button type="link"  onClick={() => history.push('/main/profile')}>Profile</Button>
        <Button type="link"  onClick={() => history.push('/main/leaves')}>Leaves</Button>
        <Button type="link"  onClick={() => history.push(`/main/workspaces/${localStorage.getItem("currentWs")}`)}>Workspace</Button>
        <Button type="link"  onClick={() => history.push('/main/calendar')}>Team Calendar</Button>
        <Button type="link"  onClick={() => history.push('/main/todo')}>Todo</Button>
        <Button type="link"  onClick={() => authService.logout()}>Log out</Button>
      </div>
      {/* <WorkspacesContext.Provider value={workspaces}> */}
        <Switch>
          <Route path="/main/workspaces" component={Workspaces} />
          <Route path="/main/calendar" component={Calendar} />
          <Redirect to="/main/workspaces" />
        </Switch>
      {/* </WorkspacesContext.Provider> */}
   </>
  )
}

export default MainMenu;