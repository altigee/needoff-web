import React, { useState, useEffect } from 'react';
import { assign } from 'lodash';
import { Button, Table, Modal, Divider } from 'antd';

import profileService from './../../services/profileService/profileService';
import sendNotification from './../notifications/notifications';
import Loading from './../loading/Loading';

import './styles.scss';
import 'antd/dist/antd.css';

const Todo = props => {
  const [loading, setLoading] = useState(true);
  const [approvalDaysOff, setApprovalDayOff] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const approvalDaysOff = await profileService.getDaysOffForApproval(
          profileService.currentWs.id
        );
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

  const approveDayOffRequest = record => {
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
  };

  const showRequestsForApprove = () => {
    const data = approvalDaysOff.map(item =>
      assign(
        {},
        {
          id: item.id,
          key: item.id,
          comment: item.comment,
          email: item.user.email,
          startDate: item.startDate,
          endDate: item.endDate,
          leaveType: item.leaveType,
          name: `${item.user.firstName} ${item.user.lastName}`
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
      <>
        <Table
          dataSource={data}
          size="small"
          columns={columns}
          pagination={false}
        />
      </>
    );
  };

  if (loading) return <Loading />;
  return (
    <>
      <div className="nd-table nd-todo-wrapper">
        {approvalDaysOff && showRequestsForApprove()}
      </div>
    </>
  );
};

export default Todo;
