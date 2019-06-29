import React from 'react';

import { Button, Modal, Table } from 'antd';
import profileService from './../../services/profileService/profileService';
import history from './../router/history';
import { Route, Redirect, Switch } from 'react-router-dom';
import WorkspaceInfo from './workspaceInfo/WorkspaceInfo';
import WorkspaceMembers from './workspaceMembers/WorkspaceMembers';
import WorspaceInvitations from './workspaceInvitations/WorkspaceInvitations';

import './styles.scss';
import 'antd/dist/antd.css'; 

const Workspace = () => {

const currentWs = localStorage.getItem("currentWs");

  return (
    <>
      <div className="nd-workspace-wrapper">
          <Button type="link" onClick={() => history.push(`/main/workspaces/${currentWs}/info`)}>
            Info
          </Button>
          <Button type="link" onClick={() => history.push(`/main/workspaces/${currentWs}/invitations`)}>
            Invitations
          </Button>
          <Button type="link" onClick={() => history.push(`/main/workspaces/${currentWs}/members`)}>
            Members
          </Button>
          <Button type="link" onClick={() => history.push(`/main/workspaces/team/holidays`)}>
            Holidays
          </Button>
          {(profileService.getMyWorkspaces.length > 1) &&
          <Button type="link" onClick={() => {
            localStorage.removeItem("currentWs");
            history.push('/main');
            }}
          >
            Change Workspace
          </Button>}
          <br />
          <Switch>
            <Route path="/main/workspaces/:currentWs/info" component={WorkspaceInfo} />
            <Route path="/main/workspaces/:currentWs/members" component={WorkspaceMembers} />
            <Route path="/main/workspaces/:currentWs/invitations" component={WorspaceInvitations} />
            <Redirect to="/main/workspaces/:currentWs/info" />
          </Switch>
        </div>
    </>
  )
}

export default Workspace;