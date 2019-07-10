import React, { useState } from 'react';
import { Tabs } from 'antd';

import history from './../router/history';
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

  const onTabChange = tab => {
    setCurrentTab(tab);
    history.push(`/main/workspace/${profileService.getWs.id}/${tab}`);
  };

  const renderTab = Component => {
    return (
      <div className="nd-table nd-workspace-tab">
        <Component />
      </div>
    );
  };

  return (
    <div className="nd-workspace-wrapper">
      <Tabs
        activeKey={activeTab}
        defaultActiveKey="workspaceInfo"
        onChange={onTabChange}
      >
        <TabPane tab="Info" key="info">
          {activeTab === 'info' && renderTab(WorkspaceInfo)}
        </TabPane>
        <TabPane tab="Invitations" key="invitations">
          {activeTab === 'invitations' && renderTab(WorkspaceInvitations)}
        </TabPane>
        <TabPane tab="Members" key="members">
          {activeTab === 'members' && renderTab(WorkspaceMembers)}
        </TabPane>
        <TabPane tab="Holidays" key="holidays">
          {activeTab === 'holidays' && renderTab(WorkspaceHolidays)}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Workspace;
