import React, { Component } from 'react';
import { Button } from 'antd';
import authService from './../authService/authService';

export default class Dashboard extends Component {

  render() {
      return (
        <>
          <div>Dashbord</div>
          <Button 
            onClick={authService.logout}
          >
            Log out
          </Button>
        </>
      );
    }  
  }