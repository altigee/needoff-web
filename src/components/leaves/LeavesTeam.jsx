import React, { useState, useEffect } from 'react';
import { get, assign } from 'lodash';
import { Table } from 'antd';
import moment from 'moment';
import Loading from './../loading/Loading';
import profileService from './../../services/profileService/profileService';
import sendNotification from './../notifications/notifications';
import { VACATIONS } from './../utils/vacations';

import './styles.scss';
import 'antd/dist/antd.css';

const LeavesTeam = () => {
  const [loading, setLoading] = useState(true);
  const [vacations, setVacations] = useState(null);
  const [sortedInfo, setSortedInfo] = useState(null);
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [balance, setBalance] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const wsId = profileService.currentWs.id;
        const [vacations, users] = await Promise.all([
          profileService.getVacationDays(wsId),
          profileService.getWSMembers(wsId)
        ]);
        setVacations(vacations.teamCalendar);
        let bal = [];
        await Promise.all(
          users.workspaceMembers.map(async user => {
            const balanceUser = await profileService.balanceByUser(
              profileService.currentWs.id,
              user.userId
            );
            const balanceUserFull = assign(balanceUser.balanceByUser, {
              id: user.userId,
              key: user.userId,
              email: user.profile.email,
              name: `${user.profile.firstName} ${user.profile.lastName}`
            });
            bal.push(balanceUserFull);
          })
        );
        setBalance(bal);
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
    },
    {
      title: 'Paid',
      dataIndex: 'leftPaidLeaves',
      key: 'leftPaidLeaves'
    },
    {
      title: 'Unpaid',
      dataIndex: 'leftUnpaidLeaves',
      key: 'leftUnpaidLeaves'
    },
    {
      title: 'Sick Leave',
      dataIndex: 'leftSickLeaves',
      key: 'leftSickLeaves'
    }
  ];

  return (
    <div className="nd-leaves-tab-team">
      <div className="nd-table nd-table-leaves-team">
        <Table
          size="small"
          dataSource={balance}
          columns={columns}
          pagination={false}
          expandRowByClick={true}
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
        case VACATIONS.SICK:
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
