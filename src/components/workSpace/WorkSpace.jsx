import React, { useState } from 'react';
import { Tabs } from 'antd';

import WorkspaceInfo from './workspaceInfo/WorkspaceInfo';
import WorkspaceMembers from './workspaceMembers/WorkspaceMembers';
import WorkspaceInvitations from './workspaceInvitations/WorkspaceInvitations';
import WorkspaceHolidays from './workspaceHolidays/WorkspaceHolidays';
import profileService from './../../services/profileService/profileService';

import './styles.scss';
import 'antd/dist/antd.css';

const { TabPane } = Tabs;

const Workspace = () => {
  const [currentTab, setCurrentTab] = useState('info');

  const activeTab = currentTab || 'info';

  return (
    <div className="nd-workspace-wrapper">
      <Tabs
        activeKey={activeTab}
        defaultActiveKey="workspaceInfo"
        onChange={setCurrentTab}
      >
        <TabPane tab="Info" key="info">
          {activeTab === 'info' && <WorkspaceInfo />}
        </TabPane>
        {profileService.isAdmin && (
          <TabPane tab="Invitations" key="invitations">
            {activeTab === 'invitations' && <WorkspaceInvitations />}
          </TabPane>
        )}
        {profileService.isAdmin && (
          <TabPane tab="Members" key="members">
            {activeTab === 'members' && <WorkspaceMembers />}
          </TabPane>
        )}
        {profileService.isAdmin && (
          <TabPane tab="Holidays" key="holidays">
            {activeTab === 'holidays' && <WorkspaceHolidays />}
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default Workspace;
