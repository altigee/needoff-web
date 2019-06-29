import React from 'react';

import { Select } from 'antd';

import 'antd/dist/antd.css'; 

const SelectForm = ({ input, options, meta, ...rest }) => (
  <>
    <Select
      {...input}
      {...rest}
      showSearch
    >
      {
        options.map(r =>
          <Select.Option value={r.name} key={r.id}>{r.name}</Select.Option>)
      }
    </Select>
    <div className='input-form-error'>
      {meta.error && meta.touched && <span>{meta.error}</span>}
    </div>  
  </>
)

export default SelectForm;