import React from 'react';

import { Input } from 'antd';

import './../styles.scss';
import 'antd/dist/antd.css';

const { TextArea } = Input;

const TextAreaForm = ({ input, meta, ...rest }) => (
  <>
    <TextArea {...input} {...rest} />
    <div className="input-form-error">
      {meta.error && meta.touched && <span>{meta.error}</span>}
    </div>
  </>
);

export default TextAreaForm;
