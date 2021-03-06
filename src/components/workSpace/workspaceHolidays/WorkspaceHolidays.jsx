import React, { useState, useEffect } from 'react';
import { assign } from 'lodash';
import { Button, Modal, Table } from 'antd';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';

import profileService from './../../../services/profileService/profileService';
import DatePickerForm from './../../form/datePickerForm/DatePickerForm';
import CheckboxForm from './../../form/checkboxForm/CheckboxFom';
import InputForm from './../../form/inputForm/InputForm';
import sendNotification from './../../notifications/notifications';
import Loading from './../../loading/Loading';
import { format, FORMATS } from './../../utils/date';

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
        const currentWs = profileService.currentWs;
        setCurrentWs(currentWs);
        const holidayDays = await profileService.getHolidayData(currentWs.id);
        setHolidays(holidayDays.workspaceDates);
      } catch (error) {
        sendNotification('error');
      }
      setLoading(false);
    })();
  }, []);

  const removeHoliday = async holiday => {
    Modal.confirm({
      title: 'Do you want to delete a holiday?',
      icon: 'check-circle',
      onOk() {
        (async () => {
          setLoading(true);
          try {
            await profileService.removeHoliday(holiday.id);
            const holidayDays = await profileService.getHolidayData(
              currentWs.id
            );
            setHolidays(holidayDays.workspaceDates);
          } catch (error) {
            sendNotification('error');
          }
          setLoading(false);
        })();
      }
    });
  };

  const onSubmitHoliday = async data => {
    setLoading(true);
    try {
      await profileService.addHoliday(data, currentWs.id);
      const holidayDays = await profileService.getHolidayData(currentWs.id);
      setHolidays(holidayDays.workspaceDates);
    } catch (error) {
      sendNotification('error');
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
    return (
      <div className="nd-table">
        <Table dataSource={data} columns={columns} pagination={false} />
      </div>
    );
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
                    <Field
                      name="date"
                      component={DatePickerForm}
                      disabledDate={date =>
                        holidays.some(
                          day => day.date === format(date, FORMATS.DEFAULT)
                        )
                      }
                    />
                  </div>
                  <br />
                  <div>
                    <Field
                      name="officialHoliday"
                      component={CheckboxForm}
                      type="checkbox"
                      label="Official Holiday"
                      defaultValue={false}
                    />
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
    <div className="nd-workspace-tab nd-workspace-holidays-wrapper">
      {visible && addHoliday()}
      {listHolidays()}
      <Button type="primary" onClick={() => setVisible(true)}>
        Add Holiday
      </Button>
    </div>
  );
};

export default WorkspaceHolidays;
