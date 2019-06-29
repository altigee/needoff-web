import history from './../../components/router/history';
import { request } from 'graphql-request';

// export const endpoint = "http://nmarchuk.pythonanywhere.com/graphql";
export const endpoint = "http://localhost:3344/graphql";

class AuthService {

  login = async ({login, password}) => {
    console.log(login);
    const mutation = `mutation {
      login(email: "${login}", password:"${password}") {
        accessToken
        refreshToken
      }
    }`;
    try {
      const data = await request(endpoint, mutation);
      localStorage.setItem("token", data.login.accessToken);
      localStorage.setItem("email", login);
      history.push('/main/workspaces');
    }
    catch (error) {
      console.log(error);
      history.push('/auth/login');
    }
  }

  register = async ({login, password, firstName, lastName}) => {
    console.log(login);
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
      localStorage.setItem("token", data.register.accessToken);
      localStorage.setItem("email", login);
      history.push('/main/profile');
    }
    catch(error) {
      console.log(error);
      history.push('/auth/signup');
    };
  }

  getStatus = () => {
    return localStorage.getItem("token");
  }

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("currentWs");
    history.push('/auth/login');
  }
}

export default new AuthService();