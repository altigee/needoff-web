import { GraphQLClient } from 'graphql-request';

// export const endpoint = "http://nmarchuk.pythonanywhere.com/graphql";
export const endpoint = "http://localhost:3344/graphql";

class profileService {

  workspaces = null;
  // wsId = null;

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
    const workspaces = await graphQLClient.request(query);
    this.workspaces = workspaces.myWorkspaces;
    return this.workspaces;
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
    return await graphQLClient.request(query);
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
    return await graphQLClient.request(query);
  }

  getUserId = async () => {
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
    return await graphQLClient.request(query);
  }  

  addHoliday = async (data, id) => {
    const format = "YYYY-MM-DD";
    const value = data.date && data.date.format(format);
    const query = `
    mutation {
      addWorkspaceDate(
        name: "${data.title}", 
        wsId: ${id}, date: "${value}", 
        isOfficialHoliday: ${data.officialHoliday}
      ) {
      ok
      }
    }
    `;
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return await graphQLClient.request(query);
  }  

  removeHoliday = async (id) => {
    const query = `
    mutation {
      removeWorkspaceDate(id: ${id}) {
        ok
      }
    }
    `;
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return await graphQLClient.request(query);
  }  

  getHolidayData = async (id) => {
    const query = `
    {
      workspaceDates(workspaceId:${id}) {
          id
          name
          date
          isOfficialHoliday
        }
      }
    `;
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return await graphQLClient.request(query);
  }  

  addWorkspaceMember = async (email, wsId) => {
    const query = `
    mutation {
      addWorkspaceMember(email: "${email}", wsId: ${wsId}) {
        ok
      }
    }
    `;
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return await graphQLClient.request(query);
  }

  getWSMembers = async (wsId) => {
    const query = `
    {
      workspaceMembers (workspaceId:10) {
        userId
        startDate
        profile {
          userId
          firstName
          lastName
          email
        }
      }
    }
    `;
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return await graphQLClient.request(query);
  }  



}  

export default new profileService();