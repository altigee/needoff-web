import React from 'react';

import { Input } from 'antd';

import './styles.scss';
import 'antd/dist/antd.css'; 

const InputForm = ({ input, meta, ...rest }) => (
  <>
    <Input
      {...input}
      {...rest}
      // autoComplete='off'
    />
    <div className='input-form-error'>
      {meta.error && meta.touched && <span>{meta.error}</span>}
    </div>
  </>
)

export default InputForm;