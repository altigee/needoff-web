import React, { Component } from 'react';
import { Spin,Icon } from 'antd';

import 'antd/dist/antd.css';

const Loading = ({ indicator, ...rest }) => {
  const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
  return (
    <>
      <Spin
        indicator={antIcon}
        {...rest}
      />
    </>
  )
}

export default Loading;