import React, { useState } from 'react';
import { Tabs } from 'antd';
import LeavesUser from './LeavesUser';
import LeavesTeam from './LeavesTeam';

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
        onChange={tab => setCurrentTab(tab)}
      >
        <TabPane tab="Personal" key="userLeaves">
          {activeTab === 'userLeaves' && <LeavesUser />}
        </TabPane>
        <TabPane tab={localStorage.getItem('currentWs')} key="teamLeaves">
          {activeTab === 'teamLeaves' && <LeavesTeam />}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Leaves;
