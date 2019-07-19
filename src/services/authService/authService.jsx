import { request } from 'graphql-request';
import jwtDecode from 'jwt-decode';
import history from './../../components/router/history';
import profileService from './../profileService/profileService';
import AUTH_ROUTES from './../../components/auth/auth.routes';
import MAIN_ROUTES from './../../components/mainMenu/main.routes';

export const endpoint = 'http://localhost:3344/graphql';

class AuthService {
  login = async ({ login, password }) => {
    const mutation = `mutation {
      login(email: "${login}", password:"${password}") {
        accessToken
        refreshToken
      }
    }`;
    try {
      const data = await request(endpoint, mutation);
      localStorage.setItem('token', data.login.accessToken);
      localStorage.setItem('email', login);
      history.push(MAIN_ROUTES.WORKSPACES);
    } catch (error) {
      history.push(AUTH_ROUTES.LOGIN);
    }
  };

  refreshTokenMock = async () => {
    const mutation = `mutation {
      login(email: "o99@alt.com", password:"ssssss") {
        accessToken
        refreshToken
      }
    }`;
    const decodeToken = jwtDecode(localStorage.getItem('token')).exp * 1000;
    const timeLeft = decodeToken - Date.now();
    console.log(timeLeft / 1000);
    if (timeLeft <= 0) {
      try {
        const response = await request(endpoint, mutation);
        localStorage.setItem('token', response.login.accessToken);
      } catch (error) {
        this.logout();
      }
    }
  };

  register = async ({ login, password, firstName, lastName }) => {
    const mutation = `mutation register {
      register(
        email: "${login}", 
        password:"${password}", 
        userData: { 
          firstName: "${firstName}",
          lastName: "${lastName}",
        }
      ) {
          userId
          accessToken
          refreshToken
        }
    }`;
    try {
      const data = await request(endpoint, mutation);
      localStorage.setItem('token', data.register.accessToken);
      localStorage.setItem('email', login);
      history.push(MAIN_ROUTES.WORKSPACES);
    } catch (error) {
      history.push(AUTH_ROUTES.SIGNUP);
    }
  };

  getToken = () => {
    return localStorage.getItem('token');
  };

  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('currentWs');
    profileService.workspaces = null;
    profileService.user = null;
    profileService.owner = null;
    history.push(AUTH_ROUTES.LOGIN);
  };
}

export default new AuthService();
