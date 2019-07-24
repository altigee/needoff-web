import React, { useState } from 'react';
import { Tabs } from 'antd';
import LeavesUser from './LeavesUser';
import LeavesTeam from './LeavesTeam';
import profileService from './../../services/profileService/profileService';

import './styles.scss';
import 'antd/dist/antd.css';

const { TabPane } = Tabs;

const Leaves = () => {
  const [currentTab, setCurrentTab] = useState('userLeaves');

  const activeTab = currentTab || 'userLeaves';

  return (
    <div className="nd-leaves-wrapper">
      <Tabs
        activeKey={activeTab}
        defaultActiveKey="userLeave"
        onChange={setCurrentTab}
      >
        <TabPane tab="Personal" key="userLeaves">
          {activeTab === 'userLeaves' && <LeavesUser />}
        </TabPane>
        {profileService.isAdmin && (
          <TabPane tab={profileService.currentWs.name} key="teamLeaves">
            {activeTab === 'teamLeaves' && <LeavesTeam />}
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default Leaves;
