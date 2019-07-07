import React, { useState, useEffect } from 'react';
import { assign } from 'lodash';
import profileService from './../../services/profileService/profileService';
import { Button, Table, Modal } from 'antd';
import DatePickerForm from './../form/datePickerForm/DatePickerForm';
import SelectForm from './../form/selectForm/SelectForm';
import InputForm from './../form/inputForm/InputForm';
import Loading from './../loading/Loading';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';

import './styles.scss';
import 'antd/dist/antd.css';

const focusOnError = createDecorator();

const Leaves = props => {
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState(null);
  const [visible, setVisible] = useState(false);
  const [vacations, setVacations] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        console.log(profileService.getWs.id);
        const [userBalance, vacations, users] = await Promise.all([
          profileService.getMyBalance(profileService.getWs.id),
          profileService.getVacationDays(profileService.getWs.id),
          profileService.getWSMembers(profileService.getWs.id)
        ]);
        setUserBalance(userBalance.myBalance);
        setVacations(vacations.teamCalendar);
        setUsers(users.workspaceMembers);
      } catch (error) {
        throw error;
      }
      setLoading(false);
    })();
  }, []);

  const showLeavesInfo = (
    paidDays,
    sickDays,
    unpaidDays,
    totalPaid,
    totalSick,
    totalUnpaid,
    wfh = '-'
  ) => {
    const data = [];
    data.push(
      assign(
        {},
        { key: profileService.user.userId, paidDays, unpaidDays, sickDays, wfh }
      )
    );
    const columns = [
      {
        title: `Sick days (Max - ${totalSick})`,
        dataIndex: 'sickDays',
        key: 'sickDays'
      },
      {
        title: `Vacation paid days (Max - ${totalPaid})`,
        dataIndex: 'paidDays',
        key: 'paidDays'
      },
      {
        title: `Vacation unpaid days (Max - ${totalUnpaid})`,
        dataIndex: 'unpaidDays',
        key: 'unpaidDays'
      },
      {
        title: 'WFH',
        dataIndex: 'wfh',
        key: 'wfh'
      }
    ];
    return (
      <div className="nd-leaves-wrapper">
        <Table dataSource={data} columns={columns} pagination={false} />
        <br />
        <Button type="primary" onClick={() => setVisible(true)}>
          Create Request
        </Button>
      </div>
    );
  };

  const listLeaves = (listUsers, listName) => {
    const expandedRowRender = record => {
      const data = vacations
        .filter(item => item.userId === Number(record.id))
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
        <div className="nd-leaves-intro-wrapper">
          <Table
            size="small"
            dataSource={data}
            columns={columns}
            pagination={false}
          />
        </div>
      );
    };

    const data = listUsers.map(item =>
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
      <div className="nd-leaves-wrapper">
        <div>{listName}</div>
        <Table
          size="small"
          dataSource={data}
          columns={columns}
          pagination={false}
          expandedRowRender={expandedRowRender}
        />
      </div>
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
      await profileService.createDayOff(data, type, profileService.getWs.id);
      const [userBalance, vacations] = await Promise.all([
        profileService.getMyBalance(profileService.getWs.id),
        profileService.getVacationDays(profileService.getWs.id)
      ]);
      setUserBalance(userBalance.myBalance);
      setVacations(vacations.teamCalendar);
    } catch (error) {
      throw error;
    }
    setLoading(false);
    setVisible(false);
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
          title="Create a Leave Request"
          visible={visible}
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
                <div>
                  <div>
                    <label>Type of Leave</label>
                    <Field
                      name="type"
                      component={SelectForm}
                      placeholder="Choose Type of Leave"
                      options={leaveTypes}
                    />
                    <br />
                  </div>
                  <div>
                    <label>First Date</label> <br />
                    <Field name="startDate" component={DatePickerForm} />
                  </div>
                  <br />
                  <div>
                    <label>Last Date</label> <br />
                    <Field name="endDate" component={DatePickerForm} />
                  </div>
                  <br />
                  <div>
                    <label>Comment</label>
                    <Field
                      name="comment"
                      component={InputForm}
                      placeholder="Comment"
                    />
                    <br />
                  </div>
                  <br />
                  <br />
                  <Button type="primary" htmlType="submit">
                    Ok
                  </Button>
                  <Button type="secondary" onClick={() => setVisible(false)}>
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

  if (loading) return <Loading />;
  const {
    leftPaidLeaves,
    leftSickLeaves,
    leftUnpaidLeaves,
    totalPaidLeaves,
    totalUnpaidLeaves,
    totalSickLeaves
  } = userBalance;
  const currentUser = users.filter(
    item => item.userId === profileService.user.userId
  );
  return (
    <>
      {showLeavesInfo(
        leftPaidLeaves,
        leftSickLeaves,
        leftUnpaidLeaves,
        totalPaidLeaves,
        totalSickLeaves,
        totalUnpaidLeaves
      )}
      {visible && createLeaveRequest()}
      {listLeaves(currentUser, 'Leaves')}
      {profileService.owner.userId === currentUser[0].userId &&
        listLeaves(users, 'Team Leaves')}
    </>
  );
};

export default Leaves;
