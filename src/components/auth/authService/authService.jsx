import history from './../../router/history';
import { request } from 'graphql-request';

// export const endpoint = "http://nmarchuk.pythonanywhere.com/graphql";
export const endpoint = "http://localhost:3344/graphql";

class AuthService {

  status = false;

  login = async (values) => {
    console.log(values);
    const mutation = `mutation {
      login(email: "${values.login}", password:"${values.password}") {
        accessToken
        refreshToken
      }
    }`;
    try {
      const data = await request(endpoint, mutation);
      this.status = true;
      localStorage.setItem("token", data.login.accessToken);
      localStorage.setItem("email", values.login);
      history.push('/dashboard');
    }
    catch (error) {
      console.log(error);
        history.push('/auth/login');
    }
  }

  register = async (values) => {
    console.log(values);
    const mutation = `mutation register {
      register(
        email: "${values.login}", 
        password:"${values.password}", 
        userData: { 
          firstName: "${values.firstName}",
          lastName: "${values.lastName}",
        }
      ) {
          userId
          accessToken
          refreshToken
        }
    }`;
    try {
      const data = await request(endpoint, mutation);
      console.log(data);
      this.status = true;
      localStorage.setItem("token", data.register.accessToken);
      localStorage.setItem("email", values.login);
      history.push('/dashboard');
    }
    catch(error) {
      console.log(error);
      history.push('/auth/signup');
    };
  }

  getStatus = () => {
    return this.status || localStorage.getItem("token");
  }

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("currentWS");
    this.status = false;
    history.push('/auth/login');
  }
}

export default new AuthService();