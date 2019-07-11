import { notification } from 'antd';

const sendNotification = type => {
  notification[type]({
    message: 'Error',
    description: `Some data was'nt received. Please check your network 
    connection or contact your system administrator`
  });
};

export default sendNotification;
