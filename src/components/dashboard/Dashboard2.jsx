import React, { Component } from 'react';
import { Button, Modal, Spin } from 'antd';
import authService from './../authService/authService';

export default class Dashboard extends Component {

  state = {loading: true };

  componentDidMount() {
    this.getWorkSpaces();
  }

  getWorkSpaces = async () => {
    this.setState({
      loading: true
    }, () => {
      authService.getMyWorkspaces();
      this.setState({ loading: false });
    })
    // console.log(this.loading);
  }

  render() {
    if (this.loading) return <Spin />
    const workSpaces = authService.workspaces;
    console.log(workSpaces);
      return (
        <>

          <div>Dashbord</div>
          <Button 
            onClick={authService.logout}
          >
            Log out
          </Button>
          <Button 
            onClick={authService.getMyWorkspaces}
          >
            Get My Workspaces
          </Button>
        </>
      );
    }  
  }