import React, { useState, useEffect } from 'react';

import 'antd/dist/antd.css'; 

const WorkSpace = (props) => {
console.log(props.match.params.currentWS);

  return (
    <>
      <div>Team: {props.match.params.currentWS}</div>
      <div>Leaves: </div>
    </>
    
  )

}

export default WorkSpace;