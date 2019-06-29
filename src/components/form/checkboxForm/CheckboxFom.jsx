import React from 'react';

import { Checkbox } from 'antd';

import 'antd/dist/antd.css'; 

const CheckboxForm = ({ input, meta, ...rest }) => (
  <>
    <Checkbox
      {...input}
      {...rest}
    />
  </>
)

export default CheckboxForm;