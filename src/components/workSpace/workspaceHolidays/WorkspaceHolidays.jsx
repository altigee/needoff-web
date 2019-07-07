import React, { useState, useEffect } from 'react';
import { assign } from 'lodash';
import profileService from './../../../services/profileService/profileService';
import { Button, Modal, Table } from 'antd';
import DatePickerForm from './../../form/datePickerForm/DatePickerForm';
import CheckboxForm from './../../form/checkboxForm/CheckboxFom';
import InputForm from './../../form/inputForm/InputForm';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import Loading from './../../loading/Loading';

import './../styles.scss';
import 'antd/dist/antd.css';

const focusOnError = createDecorator();

const WorkspaceHolidays = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentWs, setCurrentWs] = useState(null);
  const [holidays, setHolidays] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const currentWs = profileService.getWs;
        setCurrentWs(currentWs);
        const holidayDays = await profileService.getHolidayData(currentWs.id);
        setHolidays(holidayDays.workspaceDates);
      } catch (error) {
        throw error;
      }
      setLoading(false);
    })();
  }, [visible]);

  const removeHoliday = async holiday => {
    setLoading(true);
    try {
      await profileService.removeHoliday(holiday.id);
      const holidayDays = await profileService.getHolidayData(currentWs.id);
      setHolidays(holidayDays.workspaceDates);
    } catch (error) {
      throw error;
    }
    setLoading(false);
  };

  const onSubmitHoliday = async data => {
    setLoading(true);
    try {
      await profileService.addHoliday(data, currentWs.id);
      const holidayDays = await profileService.getHolidayData(currentWs.id);
      setHolidays(holidayDays.workspaceDates);
    } catch (error) {
      throw error;
    }
    setLoading(false);
    setVisible(false);
  };

  const listHolidays = () => {
    const data = holidays.map(item => assign({}, item, { key: item.id }));
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date'
      },
      {
        title: 'Type',
        key: 'isOfficialHoliday',
        render: record => (
          <span>{record.isOfficialHoliday ? 'Public Holiday' : 'Workday'}</span>
        )
      },
      {
        title: 'Action',
        key: 'action',
        render: record => (
          <span>
            <Button type="link" onClick={() => removeHoliday(record)}>
              Delete
            </Button>
          </span>
        )
      }
    ];
    return <Table dataSource={data} columns={columns} pagination={false} />;
  };

  const addHoliday = () => {
    return (
      <>
        <Modal title="Add Holiday Date" visible={visible} footer={null}>
          <Form
            onSubmit={onSubmitHoliday}
            decorators={[focusOnError]}
            validate={values => {
              const errors = {};
              if (!values.title) {
                errors.title = 'Required';
              }
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
                    <label>Title</label>
                    <Field
                      name="title"
                      component={InputForm}
                      placeholder="Title"
                    />
                    <br />
                  </div>
                  <div>
                    <label>Enter Date</label> <br />
                    <Field name="date" component={DatePickerForm} />
                  </div>
                  <br />
                  <div>
                    <Field
                      name="officialHoliday"
                      component={CheckboxForm}
                      type="checkbox"
                      defaultValue={false}
                    />
                    <label>Official Holiday</label>
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
  return (
    <div className="nd-workspace-invitations-wrapper">
      {visible && addHoliday()}
      {listHolidays()}
      <br />
      <Button type="primary" onClick={() => setVisible(true)}>
        Add Holiday
      </Button>
    </div>
  );
};

export default WorkspaceHolidays;
