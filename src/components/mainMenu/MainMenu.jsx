import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Button, Modal, Spin } from 'antd';
import history from './../router/history';

import authService from './../auth/authService/authService';
import profileService from './../profileService/profileService';

const MainMenu = () => {
  return (
    <>
      <div>Main Menu</div>
      <Button type="link"  onClick={() => history.push('/main/profile')}>Profile</Button>
      <Button type="link"  onClick={() => history.push('/main/leaves')}>Leaves</Button>
      <Button type="link"  onClick={() => history.push('/dashboard')}>Workspaces</Button>
      <Button type="link"  onClick={() => history.push('/calendar')}>Team Calendar</Button>
      <Button type="link"  onClick={() => history.push('/main/todo')}>Todo</Button>
    </>
  )
}

export default MainMenu;