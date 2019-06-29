import { GraphQLClient } from 'graphql-request';
import { find } from 'lodash';

// export const endpoint = "http://nmarchuk.pythonanywhere.com/graphql";
export const endpoint = "http://localhost:3344/graphql";

class profileService {

  workspaces = null;

  get getGraphQLClient() {
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return graphQLClient;
  }

  get getMyWorkspaces() {
    return this.workspaces;
  }

  get getWs() {
    const currentWs = find(this.workspaces, { 'name': localStorage.getItem("currentWs") });
    console.log(currentWs)
    return currentWs;
  }

  fetchMyWorkspaces = async () => {
    const query = `
    {
      myWorkspaces { 
        id
        name
        description
      }
    }
    `;
    
    try {
      const workspaces = await this.getGraphQLClient.request(query);
      this.workspaces = workspaces.myWorkspaces;
    }
    catch(error) {
      console.log(error);
      this.workspaces = null;
    }
    return this.workspaces;
  }

  createWorkspaces = async ({name, description}) => {
    const query = `
    mutation {
      createWorkspace(
        name: "${name}", 
        description: "${description}",
         members: ["${localStorage.getItem("email")}"]
      ) {
        ws{id}
      }
    }
    `;

    return await this.getGraphQLClient.request(query);
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

    return await this.getGraphQLClient.request(query);
  }

  getUserInfo = async() => {
    const query = `
    query Profile {
      profile{
        userId
        email
        firstName
        lastName
      }
    }
    `;

    return await this.getGraphQLClient.request(query);
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

    return await this.getGraphQLClient.request(query);
  }

  createDayOff = async (data, id) => {
    const value = data.date && data.date.format("YYYY-MM-DD");
    const query = `
    mutation {
      createDayOff(startDate: "2019-07-09", endDate: "2019-07-11",type: "VACATION_PAID", workspaceId:1, comment: "test"){
        ok
        dayOff{
          id
        }
        errors
        warnings
        notes
      }
    }
    `;

    return await this.getGraphQLClient.request(query);
  }  

  removeHoliday = async (id) => {
    const query = `
    mutation {
      removeWorkspaceDate(id: ${id}) {
        ok
      }
    }
    `;

    return await this.getGraphQLClient.request(query);
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

    return await this.getGraphQLClient.request(query);
  }  

  addWorkspaceMember = async (email, wsId, startDate) => {
    const query = `
    mutation {
      addWorkspaceMember(email: "${email}", wsId: ${wsId}, startDate: "${startDate}") {
        ok
      }
    }
    `;

    return await this.getGraphQLClient.request(query);
  }

  getWSMembers = async (wsId) => {
    const query = `
    {
      workspaceMembers (workspaceId:${wsId}) {
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

    return await this.getGraphQLClient.request(query);
  }

  getWSMembersInvitations = async (wsId) => {
    const query = `
    {
      workspaceInvitations (workspaceId:${wsId}) {
       id
       email
       status
       startDate
      }
     }
    `;

    return await this.getGraphQLClient.request(query);
  }

  removeWorkspaceMember = async (email, wsId) => {
    const query = `
    mutation {
      removeWorkspaceMember(email: "${email}", wsId: ${wsId},) {
        ok
      }
    }	
    `;

    return await this.getGraphQLClient.request(query);
  }

  updateWorkspaceInfo = async ({name, description}, wsId) => {
    const query = `
    mutation {
      updateWorkspace(name: "${name}", description: "${description}", wsId: ${wsId},) {
        ok
      }
    }	
    `;

    return await this.getGraphQLClient.request(query);
  }
}  

export default new profileService();