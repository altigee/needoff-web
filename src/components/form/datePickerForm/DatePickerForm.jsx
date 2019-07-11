import React from 'react';

import { DatePicker } from 'antd';

import 'antd/dist/antd.css';
import './../styles.scss';

const DatePickerForm = props => {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props;

  return (
    <>
      <DatePicker
        {...rest}
        inputProps={restInput}
        onChange={onChange}
        value={value === '' ? null : value}
      />
      <div className="input-form-error">
        {meta.error && meta.touched && <span>{meta.error}</span>}
      </div>
    </>
  );
};

export default DatePickerForm;
