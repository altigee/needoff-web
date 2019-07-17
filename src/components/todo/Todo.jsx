import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { find } from 'lodash';
import { Button, Table, Modal, Divider } from 'antd';

import profileService from './../../services/profileService/profileService';
import sendNotification from './../notifications/notifications';
import Loading from './../loading/Loading';

import './styles.scss';
import 'antd/dist/antd.css';

const Todo = props => {
  const [loading, setLoading] = useState(true);
  const [approvalDaysOff, setApprovalDayOff] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [approvalDaysOff, users] = await Promise.all([
          profileService.getDaysOffForApproval(profileService.currentWs.id),
          profileService.getWSMembers(profileService.currentWs.id)
        ]);
        setUsers(users.workspaceMembers);
        setApprovalDayOff(approvalDaysOff.dayOffsForApproval);
      } catch (error) {
        sendNotification('error');
      }
      setLoading(false);
    })();
  }, []);

  const reject = () => {
    console.log('reject');
  };

  const approveDayOffRequest = async record => {
    const isEnoughDays = async () => {
      const user = find(users, { profile: { email: record.email } });
      const userBalance = await profileService.balanceByUser(
        profileService.currentWs.id,
        user.userId
      );
      const {
        leftPaidLeaves,
        leftUnpaidLeaves,
        leftSickLeaves
      } = userBalance.balanceByUser;
      const leavePeriod = moment(record.endDate) - moment(record.startDate) + 1;
      let balance;
      switch (record.leaveType) {
        case 'VACATION_PAID':
          balance = leftPaidLeaves - leavePeriod < 0 ? false : true;
          break;
        case 'VACATION_UNPAID':
          balance = leftUnpaidLeaves - leavePeriod < 0 ? false : true;
          break;
        default:
          balance = leftSickLeaves - leavePeriod < 0 ? false : true;
      }
      return balance;
    };
    if (!(await isEnoughDays())) {
      Modal.error({
        title: 'Error',
        content: `User doesn't have enough days for this leave request`
      });
    } else {
      Modal.confirm({
        title: 'Do you want to approve this request?',
        icon: 'check-circle',
        onOk() {
          (async () => {
            try {
              await profileService.approveDayOff(record.id);
              const approvalDaysOff = await profileService.getDaysOffForApproval(
                profileService.currentWs.id
              );
              setApprovalDayOff(approvalDaysOff.dayOffsForApproval);
              props.setCount(approvalDaysOff.dayOffsForApproval.length);
            } catch (error) {
              sendNotification('error');
            }
          })();
        }
      });
    }
  };

  const showRequestsForApprove = () => {
    const data = approvalDaysOff.map(item => ({
      id: item.id,
      key: item.id,
      comment: item.comment,
      email: item.user.email,
      startDate: item.startDate,
      endDate: item.endDate,
      leaveType: item.leaveType,
      name: `${item.user.firstName} ${item.user.lastName}`
    }));
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
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
      },
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
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment'
      },
      {
        title: 'Action',
        key: 'action',
        render: record => {
          return (
            <>
              <span>
                <span>
                  <Button
                    type="link"
                    onClick={() => approveDayOffRequest(record)}
                  >
                    Approve
                  </Button>
                </span>
                <Divider type="vertical" />
                <span>
                  <Button type="link" onClick={() => reject(record)}>
                    Reject
                  </Button>
                </span>
              </span>
            </>
          );
        }
      }
    ];

    return (
      <div className="nd-table nd-table-todo">
        <Table
          dataSource={data}
          size="small"
          columns={columns}
          pagination={false}
        />
      </div>
    );
  };

  if (loading) return <Loading />;
  return (
    <>
      <div className="nd-todo-wrapper">
        {approvalDaysOff && showRequestsForApprove()}
      </div>
    </>
  );
};

export default Todo;
