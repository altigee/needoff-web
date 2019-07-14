import React, { useState, useEffect } from 'react';
import { assign, find } from 'lodash';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import {
  Button,
  Modal,
  Icon,
  Skeleton,
  Avatar,
  Card,
  Row,
  Col,
  Table
} from 'antd';
import DatePickerForm from './../../form/datePickerForm/DatePickerForm';
import sendNotification from './../../notifications/notifications';
import profileService from './../../../services/profileService/profileService';
import { format } from './../../utils/date';
import Loading from './../../loading/Loading';

import './../styles.scss';
import 'antd/dist/antd.css';

const focusOnError = createDecorator();

const { Meta } = Card;

const WorkspaceMembers = () => {
  const [visible, setVisible] = useState(false);
  const [visibleBalance, setVisibleBalance] = useState(false);
  const [visibleLeavesDetails, setVisibleLeavesDetails] = useState(false);
  const [users, setUsers] = useState(null);
  const [userById, setUserById] = useState(null);
  const [leaveType, setLeaveType] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [vacations, setVacations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [vacations, users] = await Promise.all([
          profileService.getVacationDays(profileService.currentWs.id),
          profileService.getWSMembers(profileService.currentWs.id)
        ]);
        setVacations(vacations.teamCalendar);
        setUsers(users.workspaceMembers);
      } catch (error) {
        sendNotification('error');
      }
      setLoading(false);
    })();
  }, []);

  const onSubmitStartDate = async ({ date }) => {
    const startdate = format(date);
    setLoading(true);
    try {
      await profileService.updateStartDate(
        profileService.currentWs.id,
        userById,
        startdate
      );
      const users = await profileService.getWSMembers(
        profileService.currentWs.id
      );
      setUsers(users.workspaceMembers);
    } catch (error) {
      sendNotification('error');
    }
    setLoading(false);
    setVisible(false);
  };

  const updateStartDate = () => {
    return (
      <>
        <Modal
          title="Set start date"
          visible={visible}
          footer={null}
          closable={false}
        >
          <Form
            onSubmit={onSubmitStartDate}
            decorators={[focusOnError]}
            validate={values => {
              const errors = {};
              if (!values.date) {
                errors.date = 'Required';
              }
              return errors;
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div>
                  <div>
                    <label>Date</label> <br />
                    <Field name="date" component={DatePickerForm} />
                  </div>
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

  const removeUser = async user => {
    Modal.confirm({
      title: 'Do you want to delete a user?',
      icon: 'check-circle',
      onOk() {
        (async () => {
          setLoading(true);
          try {
            await profileService.removeWorkspaceMember(
              user.profile.email,
              profileService.currentWs.id
            );
            const users = await profileService.getWSMembers(
              profileService.currentWs.id
            );
            setUsers(users.workspaceMembers);
          } catch (error) {
            sendNotification('error');
          }
          setLoading(false);
        })();
      }
    });
  };

  const balanceByUser = () => {
    return (
      <>
        <Modal
          className="nd-modal-leaves"
          visible={visibleBalance}
          footer={null}
          closable={false}
          onCancel={() => {
            setVisibleBalance(false);
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Card
                className="card card-color-green"
                title="Paid Leaves"
                onClick={() => {
                  setLeaveType('VACATION_PAID');
                  setVisibleLeavesDetails(true);
                }}
              >
                <div className="card-leaves">
                  {userBalance.leftPaidLeaves}/{userBalance.totalPaidLeaves}
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                className="card card-color-orange"
                hoverable
                title="Unpaid Leaves"
                onClick={() => {
                  setLeaveType('VACATION_UNPAID');
                  setVisibleLeavesDetails(true);
                }}
              >
                <div className="card-leaves">
                  {userBalance.leftUnpaidLeaves}/{userBalance.totalUnpaidLeaves}
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                className="card card-color-red"
                hoverable
                title="Sick Leaves"
                onClick={() => {
                  setLeaveType('SICK_LEAVE');
                  setVisibleLeavesDetails(true);
                }}
              >
                <div className="card-leaves">
                  {userBalance.leftSickLeaves}/{userBalance.totalSickLeaves}
                </div>
              </Card>
            </Col>
          </Row>
          <br /> <br />
          <Button
            type="primary"
            onClick={() => {
              setVisibleBalance(false);
            }}
          >
            Cancel
          </Button>
        </Modal>
      </>
    );
  };

  const listMembers = () => {
    return (
      <>
        <Row gutter={22}>
          {users.map(item => {
            return (
              <div key={item.userId}>
                <Col style={{ width: 350, marginTop: 24 }} span={24}>
                  <Card
                    hoverable
                    actions={[
                      <Icon
                        type="edit"
                        onClick={() => {
                          setUserById(item.userId);
                          setVisible(true);
                        }}
                      />,
                      <Icon type="delete" onClick={() => removeUser(item)} />,
                      <Icon
                        type="info"
                        onClick={async () => {
                          setUserById(item.userId);
                          try {
                            const balance = await profileService.balanceByUser(
                              profileService.currentWs.id,
                              item.userId
                            );
                            setUserBalance(balance.balanceByUser);
                          } catch (error) {
                            console.log(error);
                          }
                          setVisibleBalance(true);
                        }}
                      />
                    ]}
                  >
                    <Skeleton loading={loading} avatar active>
                      <Meta
                        avatar={
                          <Avatar
                            icon="user"
                            onClick={() => {
                              console.log('upload');
                            }}
                          />
                        }
                        title={`${item.profile.firstName} ${item.profile.lastName}`}
                      />
                    </Skeleton>
                    <br />
                    <p>
                      <strong>Email: </strong>
                      {item.profile.email}
                    </p>
                    <p>
                      <strong>Start Date: </strong>
                      {item.startDate}
                    </p>
                  </Card>
                </Col>
              </div>
            );
          })}
        </Row>
      </>
    );
  };

  const userLeaves = () => {
    const data = vacations
      .filter(
        item => item.userId === Number(userById) && item.leaveType === leaveType
      )
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
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment'
      }
    ];
    const currentUser = find(users, {
      userId: userById
    });
    return (
      <Modal
        title={`${currentUser.profile.firstName} ${currentUser.profile.lastName}`}
        className="nd-modal-leaves"
        visible={visibleLeavesDetails}
        footer={null}
        closable={false}
      >
        <div className="nd-table">
          <Table
            size="small"
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <br /> <br />
          <Button type="primary" onClick={() => setVisibleLeavesDetails(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    );
  };

  if (loading) return <Loading />;
  return (
    <div className="nd-workspace-tab nd-workspace-members-wrapper">
      {visible && updateStartDate()}
      {userById && visibleBalance && balanceByUser()}
      {listMembers()}
      {userById && visibleLeavesDetails && userLeaves()}
      <br />
    </div>
  );
};

export default WorkspaceMembers;
