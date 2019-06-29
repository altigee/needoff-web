import React, { useState, useEffect } from 'react';
import { find } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import { Button, Modal, Spin, Calendar as CalendarAntd, Alert, Badge } from 'antd';
import profileService from './../../services/profileService/profileService';
import history from '../router/history';
import './styles.scss';

const Calendar = () => {

  const [loading, setLoading] = useState(true);
  const [holidays, setHolidays] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [listdata, setListdata] = useState(null);
  // const [workspaces, setWorkspaces] = useState(null);

  useEffect(() => { 
    (async() => {
      const workspaces = await profileService.fetchMyWorkspaces();
      // setWorkspaces(workspaces);
      console.log(workspaces);
      const id = find(workspaces, { 'name': localStorage.getItem("currentWs") }).id;
      const holidayDays = await profileService.getHolidayData(id);
      setHolidays(holidayDays.workspaceDates);
      setLoading(false);
    })();
  }, [loading]);

  const onSelect = value => {
    setSelectedValue(value);
    const cellDate = value.format('YYYY-MM-DD');
    const ldata = holidays.filter(wsDay => wsDay.date === cellDate);
    setListdata(ldata);
  };

  const dateCellRender = (value) => {
    const cellDate = value.format('YYYY-MM-DD');
    const ldata = holidays.filter(wsDay => wsDay.date === cellDate);
    return (
      <>
        { !!ldata.length && <span>.</span> }
      </>
    );
  }

  const showEvents = () => {
    console.log(listdata);
    return (
      <>
        <ul className="">
          {listdata.map(item => (
            <li key={item.id}>
              {item.name}
              <br />
              {item.isOfficialHoliday ? 'Public Holiday' : 'Workday'}
            </li>
          ))}
        </ul>
      </>
    )
  }

  if (loading) return <Spin />
  console.log(holidays);
  return (
    <div>
      <Button type="link" onClick={() => history.push('/main')}>Main Page</Button>
      <CalendarAntd 
        fullscreen={false}
        dateCellRender={dateCellRender}
        onSelect={onSelect}
      />
      <br/>
      { selectedValue && !!listdata.length && <Alert
        message={showEvents()}
      /> }
    </div>
  );
}  

export default Calendar;