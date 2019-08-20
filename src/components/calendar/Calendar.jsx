import React, { useState, useEffect } from 'react';
import { find } from 'lodash';
import { Calendar as CalendarAntd, Alert, Modal, Button } from 'antd';
import Loading from './../loading/Loading';
import profileService from './../../services/profileService/profileService';
import { format, FORMATS } from './../utils/date';
import sendNotification from './../notifications/notifications';
import './styles.scss';

const Calendar = () => {
  const [loading, setLoading] = useState(true);
  const [holidays, setHolidays] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [listHolidays, setListHolidays] = useState(null);
  const [vacations, setVacations] = useState(null);
  const [listVacations, setListVacations] = useState(null);
  const [visibleDetailsInfo, setVisibleDetailsInfo] = useState(null);
  const [currentVacation, setCurrentVacation] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [holidays, vacations, users] = await Promise.all([
          profileService.getHolidayData(profileService.currentWs.id),
          profileService.getVacationDays(profileService.currentWs.id),
          profileService.getWSMembers(profileService.currentWs.id)
        ]);
        setHolidays(holidays.workspaceDates);
        setVacations(vacations.teamCalendar);
        setUsers(users.workspaceMembers);
      } catch (error) {
        sendNotification('error');
      }
      setLoading(false);
    })();
  }, []);

  const onSelect = value => {
    setSelectedValue(value);
    const cellDate = format(value);
    const ldata = holidays.filter(day => day.date === cellDate);
    setListHolidays(ldata);
    const vacdata = vacations.filter(day => {
      if (day.startDate <= cellDate && day.endDate >= cellDate) {
        return day;
      }
      return false;
    });
    setListVacations(vacdata);
  };

  const dateCellRender = value => {
    const cellDate = format(value);
    const ldata = holidays.filter(day => day.date === cellDate);
    let paid, sick, unpaid, wfh;
    const vacdata = vacations.filter(day => {
      if (day.startDate <= cellDate && day.endDate >= cellDate) {
        if (day.leaveType === 'VACATION_PAID') paid = true;
        if (day.leaveType === 'VACATION_UNPAID') unpaid = true;
        if (day.leaveType === 'SICK_LEAVE') sick = true;
        if (day.leaveType === 'WFH') wfh = true;
        return day;
      }
      return false;
    });

    return (
      <>
        {!!vacdata.length && paid && <span className="vacation-paid">.</span>}
        {!!vacdata.length && unpaid && (
          <span className="vacation-unpaid">.</span>
        )}
        {!!vacdata.length && sick && <span className="vacation-sick">.</span>}
        {!!vacdata.length && wfh && <span className="vacation-wfh">.</span>}
        {!!ldata.length && <span className="holiday-date">.</span>}
      </>
    );
  };

  const showHolidaysEvents = () => {
    return (
      <div className="holiday-alert">
        <ul>
          {listHolidays.map(item => (
            <li key={item.id} className="calendar-event">
              <span>
                <strong>{`${item.name} `}</strong>
              </span>
              <span className="alert-holiday-description">
                ({item.isOfficialHoliday ? 'Public Holiday' : 'Workday'})
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const leavesMessages = (list, messageType) => {
    return (
      <div className="leave-alert">
        <Alert
          type={messageType}
          message={
            <ul>
              {list.map(item => {
                let type = item.leaveType;
                if (type === 'VACATION_PAID') {
                  type =
                    item.startDate === item.endDate
                      ? 'Vacation (1 day)'
                      : 'Vacation';
                } else if (type === 'VACATION_UNPAID') {
                  type =
                    item.startDate === item.endDate
                      ? 'Vacation upaid (1 day)'
                      : 'Vacation (unpaid)';
                } else if (type === 'SICK_LEAVE') {
                  type = 'Sick leave';
                } else {
                  type = 'WFH';
                }
                return (
                  <li
                    key={item.id}
                    className="calendar-event"
                    onClick={() => {
                      setCurrentVacation(item);
                      setVisibleDetailsInfo(true);
                    }}
                  >
                    <strong>
                      {item.user.firstName} {item.user.lastName}
                    </strong>
                    <br />
                    <span>Type: {type}</span>
                    <br />
                  </li>
                );
              })}
            </ul>
          }
        />
      </div>
    );
  };

  const showLeavesEvents = () => {
    const paid = listVacations.filter(
      item => item.leaveType === 'VACATION_PAID'
    );
    const unpaid = listVacations.filter(
      item => item.leaveType === 'VACATION_UNPAID'
    );
    const sick = listVacations.filter(item => item.leaveType === 'SICK_LEAVE');
    const wfh = listVacations.filter(item => item.leaveType === 'WFH');
    return (
      <>
        {!!paid.length && leavesMessages(paid, 'success')}
        {!!sick.length && leavesMessages(sick, 'error')}
        {!!wfh.length && leavesMessages(wfh, 'info')}
        {!!unpaid.length && leavesMessages(unpaid, 'warning')}
      </>
    );
  };

  if (loading) return <Loading />;
  return (
    <div className="nd-calendar-wrapper">
      <CalendarAntd
        fullscreen={false}
        dateCellRender={dateCellRender}
        onSelect={onSelect}
        className="calendar"
      />
      <br />
      {selectedValue && !!listHolidays.length && (
        <Alert type={'error'} message={showHolidaysEvents()} />
      )}
      {selectedValue && !!listVacations.length && showLeavesEvents()}
      {visibleDetailsInfo && showDetailsInfo()}
    </div>
  );

  function showDetailsInfo() {
    const approvePerson = find(users, {
      userId: String(currentVacation.approvedById)
    });
    return (
      <Modal
        visible={visibleDetailsInfo}
        footer={null}
        closable={false}
        className="details-info-modal"
      >
        <div className="details-vacation">
          <div className="details-vacation-info">
            <span>
              Period:
              <span className="details-data">
                {` ${format(currentVacation.startDate, FORMATS.SECONDARY)} -
                  ${format(currentVacation.endDate, FORMATS.SECONDARY)}`}
              </span>
            </span>
            <br />
            <span>
              Comment:{' '}
              <span className="details-data">{currentVacation.comment}</span>
            </span>
            <br />
            <span>
              {` Approved by: `}
              <span className="details-data">
                {`${approvePerson.profile.firstName} 
                ${approvePerson.profile.lastName} `}
              </span>
            </span>
          </div>
          <Button type="primary" onClick={() => setVisibleDetailsInfo(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }
};

export default Calendar;
