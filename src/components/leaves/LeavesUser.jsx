import React, { useState, useEffect } from 'react';
import { find } from 'lodash';
import { Button, Table, Modal, Card } from 'antd';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';

import DatePickerForm from './../form/datePickerForm/DatePickerForm';
import SelectForm from './../form/selectForm/SelectForm';
import InputForm from './../form/inputForm/InputForm';
import Loading from './../loading/Loading';
import profileService from './../../services/profileService/profileService';
import sendNotification from './../notifications/notifications';

import './styles.scss';
import 'antd/dist/antd.css';

const focusOnError = createDecorator();

const LeavesUser = () => {
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState(null);
  const [visibleCreateRequest, setVisibleCreateRequest] = useState(false);
  const [vacations, setVacations] = useState(null);
  const [users, setUsers] = useState(null);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    (async () => {
      try {
        const wsId = profileService.currentWs.id;
        const [userBalance, vacations, users] = await Promise.all([
          profileService.getMyBalance(wsId),
          profileService.getVacationDays(wsId),
          profileService.getWSMembers(wsId)
        ]);
        setUserBalance(userBalance.myBalance);
        setVacations(vacations.teamCalendar);
        setUsers(users.workspaceMembers);
      } catch (error) {
        sendNotification('error');
      }
      setLoading(false);
    })();
  }, []);

  const showLeavesInfo = ({
    leftPaidLeaves,
    leftSickLeaves,
    leftUnpaidLeaves,
    totalPaidLeaves,
    totalSickLeaves,
    totalUnpaidLeaves
  }) => {
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
      <>
        <div className="nd-table nd-table-personal-balance">
          <Table dataSource={data} columns={columns} pagination={false} />
        </div>
        <Button type="primary" onClick={() => setVisibleCreateRequest(true)}>
          Add Leave Day
        </Button>
      </>
    );
  };

  const onSubmitCreateLeaves = async data => {
    setLoading(true);
    let type;
    switch (data.type) {
      case 'Paid vacation':
        type = 'VACATION_PAID';
        break;
      case 'Unpaid vacation':
        type = 'VACATION_UNPAID';
        break;
      case 'Sick leave':
        type = 'SICK_LEAVE';
        break;
      default:
        type = 'WFH';
    }
    try {
      await profileService.createDayOff(
        data,
        type,
        profileService.currentWs.id
      );
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

  const createLeaveRequest = () => {
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
                    <Field name="startDate" component={DatePickerForm} />
                  </div>
                  <div>
                    <label>Last Date</label> <br />
                    <Field name="endDate" component={DatePickerForm} />
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
  };

  const listUserLeaves = user => {
    const showListLeaves = dataLeaves => {
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
            dataSource={dataLeaves}
            columns={columns}
            pagination={false}
          />
        </div>
      );
    };

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
  };

  if (loading) return <Loading />;

  const currentUser = find(users, { userId: profileService.user.userId });
  return (
    <div className="nd-leaves-tab-personal">
      {showLeavesInfo(userBalance)}
      {visibleCreateRequest && createLeaveRequest()}
      {listUserLeaves(currentUser)}
    </div>
  );
};

export default LeavesUser;
