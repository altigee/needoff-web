import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { Table } from 'antd';
import moment from 'moment';
import Loading from './../loading/Loading';
import profileService from './../../services/profileService/profileService';
import sendNotification from './../notifications/notifications';
import { VACATIONS } from './../utils/constants';

import './styles.scss';
import 'antd/dist/antd.css';

const LeavesTeam = () => {
  const [loading, setLoading] = useState(true);
  const [vacations, setVacations] = useState(null);
  const [users, setUsers] = useState(null);
  const [sortedInfo, setSortedInfo] = useState(null);
  const [filteredInfo, setFilteredInfo] = useState(null);

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

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
  };

  if (loading) return <Loading />;

  const data = users.map(item => ({
    id: item.userId,
    key: item.userId,
    email: item.profile.email,
    name: `${item.profile.firstName} ${item.profile.lastName}`
  }));
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

  function userLeaves(user) {
    const renderLeaveType = data => {
      let type;
      switch (data.leaveType) {
        case VACATIONS.PAID:
          type = 'Paid vacation';
          break;
        case VACATIONS.UNPAID:
          type = 'Unpaid vacation';
          break;
        case VACATIONS.LEAVE:
          type = 'Sick leave';
          break;
        default:
          type = 'Work From Home';
      }
      return <span>{type}</span>;
    };

    const leaveType = [
      { text: 'Paid vacation', value: VACATIONS.PAID },
      { text: 'Unpaid vacation', value: VACATIONS.UNPAID },
      { text: 'Sick leave', value: VACATIONS.SICK },
      { text: 'WFH', value: VACATIONS.WFH }
    ];

    const data = vacations
      .filter(item => item.userId === Number(user.id))
      .map(item => ({
        id: item.id,
        key: item.id,
        startDate: item.startDate,
        endDate: item.endDate,
        leaveType: item.leaveType,
        comment: item.comment
      }));

    const columns = [
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        sorter: (a, b) => moment(a.startDate) - moment(b.startDate),
        sortOrder:
          sortedInfo && sortedInfo.columnKey === 'startDate' && sortedInfo.order
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate'
      },
      {
        title: 'Type',
        key: 'leaveType',
        filters: leaveType,
        filteredValue: get(filteredInfo, 'leaveType') || null,
        onFilter: (value, record) => record.leaveType.includes(value),
        sorter: (a, b) =>
          a.leaveType < b.leaveType ? -1 : a.leaveType > b.leaveType ? 1 : 0,
        sortOrder:
          sortedInfo &&
          sortedInfo.columnKey === 'leaveType' &&
          sortedInfo.order,
        render: renderLeaveType
      }
    ];
    return (
      <div className="nd-table inner-table">
        <Table
          size="small"
          dataSource={data}
          columns={columns}
          onChange={handleChange}
          pagination={{ pageSize: 5 }}
        />
      </div>
    );
  }
};

export default LeavesTeam;
