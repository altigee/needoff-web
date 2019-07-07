import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { Button, Badge } from 'antd';
import history from './../router/history';
import { Route, Redirect, Switch } from 'react-router-dom';
import authService from './../../services/authService/authService';
import profileService from './../../services/profileService/profileService';
import Loading from './../loading/Loading';
import WorkspacesList from './../worspaces/WorkspacesList';
import Workspace from './../workspace/Workspace';
import Calendar from './../calendar/Calendar';
import Profile from './../profile/Profile';
import Leaves from './../leaves/Leaves';
import Todo from './../todo/Todo';
import MAIN_ROUTES from './main.routes';

import './styles.scss';
import 'antd/dist/antd.css';

const MainMenu = () => {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [currentWsId, setCurrentWsId] = useState(null);
  const [ownerWs, setOwnerWs] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [workspaces, currentUser] = await Promise.all([
          profileService.fetchMyWorkspaces(),
          profileService.getUserInfo()
        ]);
        setCurrentUser(currentUser);
        if (get(workspaces, 'length')) {
          const lsCurrentWs = localStorage.getItem('currentWs');
          if (lsCurrentWs) {
            setCurrentWsId(profileService.getWs.id);
            history.push(`/main/workspace/${lsCurrentWs}/info`);
          }
          if (workspaces.length === 1) {
            localStorage.setItem('currentWs', workspaces[0].name);
            setCurrentWsId(profileService.getWs.id);
            history.push(`/main/workspace/${lsCurrentWs}/info`);
          }
        } else {
          history.push(MAIN_ROUTES.WORKSPACES);
        }
      } catch (error) {
        throw error;
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (currentWsId && currentUser) {
        const owner = await profileService.getWsOwner(currentWsId);
        setOwnerWs(owner);
        if (owner.userId === get(currentUser, 'userId')) {
          try {
            const approvalDaysOff = await profileService.getDaysOffForApproval(
              currentWsId
            );
            setCount(approvalDaysOff.dayOffsForApproval.length);
          } catch (error) {
            throw error;
          }
        }
      }
    })();
  }, [currentUser, currentWsId]);

  const setWsId = wsId => setCurrentWsId(wsId);
  const setCountRequests = count => setCount(count);

  if (loading) return <Loading />;
  const currentWs = localStorage.getItem('currentWs');
  return (
    <>
      <div className="nd-main-wrapper">
        <Button type="link" onClick={() => history.push(MAIN_ROUTES.PROFILE)}>
          Profile
        </Button>
        <Button
          disabled={!currentWsId}
          type="link"
          onClick={() => history.push(MAIN_ROUTES.LEAVES)}
        >
          Leaves
        </Button>
        <Button
          type="link"
          onClick={() => history.push(MAIN_ROUTES.WORKSPACES)}
        >
          Workspaces
        </Button>
        <Button
          disabled={!currentWsId}
          type="link"
          onClick={() => history.push(MAIN_ROUTES.CALENDAR)}
        >
          Team Calendar
        </Button>
        {get(ownerWs, 'userId') === currentUser.userId && (
          <Badge count={count}>
            <Button type="link" onClick={() => history.push(MAIN_ROUTES.TODO)}>
              Todo
            </Button>
          </Badge>
        )}
        <Button type="link" onClick={() => authService.logout()}>
          Log out
        </Button>
        {currentWsId && (
          <Button
            type="link"
            className="nd-btn-current-ws"
            onClick={() => history.push(`/main/workspace/${currentWs}/info`)}
          >
            {currentWs}
          </Button>
        )}
      </div>
      <Switch>
        <Route
          path={MAIN_ROUTES.WORKSPACES}
          render={props => <WorkspacesList setWsId={setWsId} {...props} />}
        />
        <Route path={MAIN_ROUTES.CALENDAR} component={Calendar} />
        <Route path={MAIN_ROUTES.PROFILE} component={Profile} />
        <Route path={MAIN_ROUTES.LEAVES} component={Leaves} />
        <Route path={MAIN_ROUTES.WORKSPACE} component={Workspace} />
        <Route
          path={MAIN_ROUTES.TODO}
          render={props => <Todo setCount={setCountRequests} {...props} />}
        />
        <Redirect to={MAIN_ROUTES.WORKSPACES} />
      </Switch>
    </>
  );
};

export default MainMenu;
