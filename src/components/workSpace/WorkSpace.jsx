import React, { useState } from 'react';
import { Tabs } from 'antd';

import WorkspaceInfo from './workspaceInfo/WorkspaceInfo';
import WorkspaceMembers from './workspaceMembers/WorkspaceMembers';
import WorkspaceInvitations from './workspaceInvitations/WorkspaceInvitations';
import WorkspaceHolidays from './workspaceHolidays/WorkspaceHolidays';

import './styles.scss';
import 'antd/dist/antd.css';

const { TabPane } = Tabs;

const Workspace = () => {
  const [currentTab, setCurrentTab] = useState('info');

  const activeTab = currentTab || 'info';

  const onTabChange = tab => {
    setCurrentTab(tab);
  };

  return (
    <div className="nd-workspace-wrapper">
      <Tabs
        activeKey={activeTab}
        defaultActiveKey="workspaceInfo"
        onChange={onTabChange}
      >
        <TabPane tab="Info" key="info">
          {activeTab === 'info' && <WorkspaceInfo />}
        </TabPane>
        <TabPane tab="Invitations" key="invitations">
          {activeTab === 'invitations' && <WorkspaceInvitations />}
        </TabPane>
        <TabPane tab="Members" key="members">
          {activeTab === 'members' && <WorkspaceMembers />}
        </TabPane>
        <TabPane tab="Holidays" key="holidays">
          {activeTab === 'holidays' && <WorkspaceHolidays />}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Workspace;
