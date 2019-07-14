import React, { useState, useEffect } from 'react';
import { assign } from 'lodash';
import { Table } from 'antd';
import Loading from './../loading/Loading';
import profileService from './../../services/profileService/profileService';
import sendNotification from './../notifications/notifications';

import './styles.scss';
import 'antd/dist/antd.css';

const LeavesTeam = () => {
  const [loading, setLoading] = useState(true);
  const [vacations, setVacations] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const wsId = profileService.currentWs.id;
        const [vacations, users] = await Promise.all([
          profileService.getVacationDays(wsId),
          profileService.getWSMembers(wsId)
        ]);
        setVacations(vacations.teamCalendar);
        setUsers(users.workspaceMembers);
      } catch (error) {
        sendNotification('error');
      }
      setLoading(false);
    })();
  }, []);

  const userLeaves = user => {
    const data = vacations
      .filter(item => item.userId === Number(user.id))
      .map(item =>
        assign(
          {},
          {
            id: item.id,
            key: item.id,
            startDate: item.startDate,
            endDate: item.endDate,
            leaveType: item.leaveType,
            comment: item.comment
          }
        )
      );

    const columns = [
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate'
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate'
      },
      {
        title: 'Type',
        key: 'leaveType',
        render: record => {
          let type;
          switch (record.leaveType) {
            case 'VACATION_PAID':
              type = 'Paid vacation';
              break;
            case 'VACATION_UNPAID':
              type = 'Unpaid vacation';
              break;
            case 'SICK_LEAVE':
              type = 'Sick leave';
              break;
            default:
              type = 'Work From Home';
          }
          return <span>{type}</span>;
        }
      }
    ];
    return (
      <div className="nd-table inner-table">
        <Table
          size="small"
          dataSource={data}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  };

  if (loading) return <Loading />;

  const data = users.map(item =>
    assign(
      {},
      {
        id: item.userId,
        key: item.userId,
        email: item.profile.email,
        name: `${item.profile.firstName} ${item.profile.lastName}`
      }
    )
  );
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    }
  ];
  return (
    <div className="nd-leaves-tab-team">
      <div className="nd-table nd-table-leaves-team">
        <Table
          size="small"
          dataSource={data}
          columns={columns}
          pagination={false}
          expandedRowRender={userLeaves}
        />
      </div>
    </div>
  );
};

export default LeavesTeam;
