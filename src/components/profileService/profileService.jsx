import { GraphQLClient } from 'graphql-request';

export const endpoint = "http://nmarchuk.pythonanywhere.com/graphql";
//export const endpoint = "http://localhost:3344/graphql";

class profileService {

  workspaces = null;

  getMyWorkspaces = async () => {
    const query = `
    {
      myWorkspaces { 
        id
        name
        description
      }
    }
    `;

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return graphQLClient.request(query)
    .then(data => {
      this.workspaces = data.myWorkspaces;
      return this.workspaces;
    });
  }

  createWorkspaces = async (values) => {
    const query = `
    mutation {
      createWorkspace(name: "${values.team}", description: "${values.description}", members: ["${localStorage.getItem("email")}"]) {
        ws{id}
      }
    }
    `;

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return graphQLClient.request(query)
    .then(data => {
      console.log(data);
      return data;
    });
  }  

    getMyLeaves = async (ws) => {

    const query = `
    query {
      myLeaves(workspaceId: ${ws}) {
        id
        startDate
        endDate
        approvedBy{
          email
        }
        leaveType
      }
    }
    `;

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return graphQLClient.request(query)
    .then(data => {
      return data;
    });
  }

  getUserId = async (ws) => {

    const query = `
    query Profile {
      profile{userId}
    }
    `;

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return graphQLClient.request(query)
    .then(data => {
      console.log(data);
      return data;
    });
  }  

}  

export default new profileService();