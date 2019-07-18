import React from 'react';

import { Checkbox } from 'antd';

import 'antd/dist/antd.css';

const CheckboxForm = ({ input, meta, label, ...rest }) => (
  <>
    <Checkbox {...input} {...rest} {...label}>
      {label}
    </Checkbox>
  </>
);

export default CheckboxForm;
