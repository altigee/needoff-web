import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { find, get } from 'lodash';
import { Button, Table, Modal, Card, Switch, Icon } from 'antd';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';

import DatePickerForm from './../form/datePickerForm/DatePickerForm';
import SelectForm from './../form/selectForm/SelectForm';
import InputForm from './../form/inputForm/InputForm';
import Loading from './../loading/Loading';
import profileService from './../../services/profileService/profileService';
import sendNotification from './../notifications/notifications';
import { format, FORMATS } from './../utils/date';
import { VACATIONS } from './../utils/vacations';

import './styles.scss';
import 'antd/dist/antd.css';

const focusOnError = createDecorator();
const GAP = 14;

const LeavesUser = () => {
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState(null);
  const [visibleCreateRequest, setVisibleCreateRequest] = useState(false);
  const [visibleHistory, setVisibleHistory] = useState(false);
  const [vacations, setVacations] = useState(null);
  const [users, setUsers] = useState(null);
  const [tab, setTab] = useState('pending');
  const [sortedInfo, setSortedInfo] = useState(null);
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [holidays, setHolidays] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const wsId = profileService.currentWs.id;
        const [userBalance, vacations, users, holidays] = await Promise.all([
          profileService.getMyBalance(wsId),
          profileService.getVacationDays(wsId),
          profileService.getWSMembers(wsId),
          profileService.getHolidayData(wsId)
        ]);
        setUserBalance(userBalance.myBalance);
        setVacations(vacations.teamCalendar);
        setUsers(users.workspaceMembers);
        setHolidays(holidays.workspaceDates);
      } catch (error) {
        sendNotification('error');
      }
      setLoading(false);
    })();
  }, []);

  const onSubmitCreateLeaves = async data => {
    const dataApproved = vacations
      .filter(item => item.userId === Number(profileService.user.userId))
      .map(item => ({
        startDate: item.startDate,
        endDate: item.endDate
      }));
    const startDate = format(data.startDate);
    const endDate = format(data.endDate);
    const busyVacation = dataApproved.some(
      day => (startDate < day.startDate) & (endDate > day.endDate)
    );
    const busyHoliday = holidays.some(
      day => (startDate < day.date) & (endDate > day.date)
    );
    if (busyVacation) {
      Modal.error({
        title: 'Error',
        content: 'You already have vacation day in that period'
      });
      return;
    }
    if (busyHoliday) {
      Modal.error({
        title: 'Error',
        content: 'You request has a holiday. Please change your vacation date.'
      });
      return;
    }
    let type;
    switch (data.type) {
      case 'Paid vacation':
        type = VACATIONS.PAID;
        break;
      case 'Unpaid vacation':
        type = VACATIONS.UNPAID;
        break;
      case 'Sick leave':
        type = VACATIONS.SICK;
        break;
      default:
        type = VACATIONS.WFH;
    }
    setLoading(true);
    try {
      const response = await profileService.createDayOff(
        data,
        type,
        profileService.currentWs.id
      );
      if (response.createDayOff.errors.length) {
        Modal.error({
          title: 'Error',
          content: response.createDayOff.errors[0]
        });
        setLoading(false);
        setVisibleCreateRequest(false);
        return;
      }
      const [userBalance, vacations] = await Promise.all([
        profileService.getMyBalance(profileService.currentWs.id),
        profileService.getVacationDays(profileService.currentWs.id)
      ]);
      setUserBalance(userBalance.myBalance);
      setVacations(vacations.teamCalendar);
    } catch (error) {
      sendNotification('error');
    }
    setLoading(false);
    setVisibleCreateRequest(false);
  };

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setFilteredInfo(filters);
  };

  if (loading) return <Loading />;

  const currentUser = find(users, { userId: profileService.user.userId });
  return (
    <div className="nd-leaves-tab-personal">
      {showLeavesInfo(userBalance)}
      {visibleCreateRequest && createLeaveRequest()}
      <label>Details</label> <br />
      <Switch
        checkedChildren={<Icon type="check" />}
        unCheckedChildren={<Icon type="close" />}
        onChange={history => !setVisibleHistory(history)}
      />
      {visibleHistory && listUserLeaves(currentUser)}
    </div>
  );

  function showLeavesInfo({
    leftPaidLeaves,
    leftSickLeaves,
    leftUnpaidLeaves,
    totalPaidLeaves,
    totalSickLeaves,
    totalUnpaidLeaves
  }) {
    const data = [];
    const { userId } = profileService.user;
    data.push({
      key: userId,
      leftPaidLeaves,
      leftUnpaidLeaves,
      leftSickLeaves
    });
    const columns = [
      {
        title: `Sick days (Max - ${totalSickLeaves})`,
        dataIndex: 'leftSickLeaves',
        key: 'leftSickLeaves'
      },
      {
        title: `Paid days (Max - ${totalPaidLeaves})`,
        dataIndex: 'leftPaidLeaves',
        key: 'leftPaidLeaves'
      },
      {
        title: `Unpaid days (Max - ${totalUnpaidLeaves})`,
        dataIndex: 'leftUnpaidLeaves',
        key: 'leftUnpaidLeaves'
      }
    ];
    return (
      <div className="leaves-info">
        <div className="nd-table nd-table-personal-balance">
          <Table dataSource={data} columns={columns} pagination={false} />
        </div>
        <Button type="primary" onClick={() => setVisibleCreateRequest(true)}>
          Add Leave Day
        </Button>
      </div>
    );
  }

  function disabledDate(date) {
    const currentDate = format(date, FORMATS.DEFAULT);
    const userVacations = vacations.filter(date => {
      return Number(profileService.user.userId) === date.userId;
    });
    return (
      userVacations.some(day => {
        return (
          day.startDate === currentDate ||
          (day.startDate < currentDate && day.endDate >= currentDate)
        );
      }) ||
      date < moment().add(GAP, 'days') ||
      holidays.some(day => day.date === currentDate)
    );
  }

  function createLeaveRequest() {
    const leaveTypes = [
      { key: '1', id: '1', name: 'Paid vacation' },
      { key: '2', id: '2', name: 'Unpaid vacation' },
      { key: '3', id: '3', name: 'Sick leave' },
      { key: '4', id: '4', name: 'Work from home' }
    ];
    return (
      <>
        <Modal
          title="Create Request"
          visible={visibleCreateRequest}
          footer={null}
          closable={false}
        >
          <Form
            onSubmit={onSubmitCreateLeaves}
            decorators={[focusOnError]}
            validate={values => {
              const errors = {};
              if (!values.type) {
                errors.type = 'Required';
              }
              if (!values.startDate) {
                errors.startDate = 'Required';
              }
              if (!values.endDate) {
                errors.endDate = 'Required';
              }
              if (!values.comment) {
                errors.comment = 'Required';
              }
              return errors;
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="nd-leaves-form-user-request">
                  <div>
                    <label>Type of Leave</label>
                    <Field
                      name="type"
                      component={SelectForm}
                      placeholder="Choose Type of Leave"
                      options={leaveTypes}
                    />
                  </div>
                  <div>
                    <label>First Date</label> <br />
                    <Field
                      name="startDate"
                      component={DatePickerForm}
                      disabledDate={disabledDate}
                    />
                  </div>
                  <div>
                    <label>Last Date</label> <br />
                    <Field
                      name="endDate"
                      component={DatePickerForm}
                      disabledDate={disabledDate}
                    />
                  </div>
                  <div>
                    <label>Comment</label>
                    <Field
                      name="comment"
                      component={InputForm}
                      placeholder="Comment"
                    />
                  </div>
                  <br />
                  <br />
                  <Button type="primary" htmlType="submit">
                    Ok
                  </Button>
                  <Button
                    type="secondary"
                    onClick={() => setVisibleCreateRequest(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </Modal>
      </>
    );
  }

  function listUserLeaves(user) {
    const tabList = [
      {
        key: 'pending',
        tab: 'pending'
      },
      {
        key: 'approved',
        tab: 'approved'
      }
    ];

    const dataApproved = vacations
      .filter(item => item.userId === Number(user.profile.userId))
      .map(item => ({
        id: item.id,
        key: item.id,
        startDate: item.startDate,
        endDate: item.endDate,
        leaveType: item.leaveType,
        comment: item.comment
      }));

    const dataPending = [];

    const contentList = {
      pending: showListLeaves(dataPending),
      approved: showListLeaves(dataApproved)
    };

    return (
      <div className="nd-leaves-personal-info">
        <Card
          tabList={tabList}
          activeTabKey={tab}
          onTabChange={key => setTab(key)}
        >
          {contentList[tab]}
        </Card>
      </div>
    );
  }

  function showListLeaves(dataLeaves) {
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
          dataSource={dataLeaves}
          columns={columns}
          pagination={{ pageSize: 5 }}
          onChange={handleChange}
        />
      </div>
    );
  }
};

export default LeavesUser;
