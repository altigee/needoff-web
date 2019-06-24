import history from './../router/history';
import { request, GraphQLClient } from 'graphql-request';

export const endpoint = "http://nmarchuk.pythonanywhere.com/graphql";

class profileService {

  workspaces = null;

  getMyWorkspaces = async () => {
    const query = `
    {
      myWorkspaces { 
        id
        name
      }
    }
    `;

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    const ws = await graphQLClient.request(query)
    .then(data => {
      this.workspaces = data.myWorkspaces;
      return this.workspaces;
    });

    return ws;
  }

  createWorkspaces = async (values) => {
    const query = `
    mutation {
      createWorkspace(name: "${values.team}", description: "description ${values.teams}", members: ["${localStorage.getItem("email")}"]) {
        ws{id}
      }
    }
    `;

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    const ws = await graphQLClient.request(query)
    .then(data => {
      console.log(data);
      return data;
    });
  }

}  

export default new profileService();