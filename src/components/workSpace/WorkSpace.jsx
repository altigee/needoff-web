import React from 'react';

import { Button } from 'antd';
import history from './../router/history';
import { Route, Switch } from 'react-router-dom';
import WorkspaceInfo from './workspaceInfo/WorkspaceInfo';
import WorkspaceMembers from './workspaceMembers/WorkspaceMembers';
import WorspaceInvitations from './workspaceInvitations/WorkspaceInvitations';
import WorspaceHolidays from './workspaceHolidays/WorkspaceHolidays';
import WORKSPACE_ROUTES from './workspace.routes';

import './styles.scss';
import 'antd/dist/antd.css';

const Workspace = () => {
  const currentWs = localStorage.getItem('currentWs');
  return (
    <>
      <div className="nd-workspace-wrapper">
        <Button
          type="link"
          onClick={() => history.push(`/main/workspace/${currentWs}/info`)}
        >
          Info
        </Button>
        <Button
          type="link"
          onClick={() =>
            history.push(`/main/workspace/${currentWs}/invitations`)
          }
        >
          Invitations
        </Button>
        <Button
          type="link"
          onClick={() => history.push(`/main/workspace/${currentWs}/members`)}
        >
          Members
        </Button>
        <Button
          type="link"
          onClick={() => history.push(`/main/workspace/${currentWs}/holidays`)}
        >
          Holidays
        </Button>
        <br />
        <Switch>
          <Route path={WORKSPACE_ROUTES.INFO} component={WorkspaceInfo} />
          <Route path={WORKSPACE_ROUTES.MEMBERS} component={WorkspaceMembers} />
          <Route
            path={WORKSPACE_ROUTES.INVITATIONS}
            component={WorspaceInvitations}
          />
          <Route
            path={WORKSPACE_ROUTES.HOLIDAYS}
            component={WorspaceHolidays}
          />
        </Switch>
      </div>
    </>
  );
};

export default Workspace;
