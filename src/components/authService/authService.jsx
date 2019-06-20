import history from './../router/history';
import { request } from 'graphql-request';

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

    await request("http://nmarchuk.pythonanywhere.com/graphql", mutation)
      .then(data => {
        console.log(data.login);
        this.status = true;
        localStorage.setItem("token", data.login.accessToken);
        history.push('/dashboard');
        })
      .catch(error => {
        console.log(error);
        history.push('/auth/login');
      });
  }

  getStatus = () => {
    return this.status || localStorage.getItem("token");
  }

  logout = () => {
    localStorage.removeItem("token");
    this.status = false;
    history.push('/auth/login');
  }
  

}

export default new AuthService();