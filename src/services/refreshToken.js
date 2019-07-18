import authService from './authService/authService';
import jwtDecode from 'jwt-decode';

const TOKEN_REFRESH_INTERVAL = 900000;
const DELTA = 60000;

let timeout = null;
let logout = null;

const refreshToken = data => {
  clearTimeout(timeout);
  clearTimeout(logout);
  const token = localStorage.getItem('token');
  const decodeToken = jwtDecode(token).exp * 1000;
  const timeLeft = decodeToken - Date.now();

  console.log('refresh token after: ', (timeLeft - DELTA) / 1000);
  timeout = setTimeout(() => {
    authService.refreshTokenMock(data);
  }, timeLeft - DELTA);
  logout = setTimeout(() => {
    authService.logout();
  }, TOKEN_REFRESH_INTERVAL);
};

export default refreshToken;
