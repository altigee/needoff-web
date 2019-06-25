import React, { useState, useEffect } from 'react';
import profileService from './../../profileService/profileService';
import { Spin } from 'antd';

import 'antd/dist/antd.css'; 

const WorkSpace = (props) => {
  console.log(props.ws);
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState(null);

  useEffect(() => {
    const fetchLeaves = async() => {
      try {
        const leaves = await profileService.getMyLeaves(props.ws.id);
        console.log(leaves);
        setLeaves(leaves.myLeaves);
      } catch (error) {
        
      };
      setLoading(false);
    }; 
    fetchLeaves();
  },[props.ws.id]);

  if (loading) return <Spin />
  
  return (
    <>
      <div>Team: {props.ws.name}</div>
      <div>Descriptin: {props.ws.description}</div>
      <div>Leaves: {leaves}</div>
    </>
  )
}

export default WorkSpace;