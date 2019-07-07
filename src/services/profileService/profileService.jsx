import { GraphQLClient } from 'graphql-request';
import { find } from 'lodash';
import { format } from './../../components/utils/date';

export const endpoint = "http://localhost:3344/graphql";

class profileService {

  workspaces = null;
  user = null;
  owner = null;

  graphqlClient = async(query) => {
    const response = await fetch('http://localhost:3344/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({query}),
    });
    return await (await response.json()).data;
  }

  get getMyWorkspaces() {
    return this.workspaces;
  }

  get getWs() {
    const currentWs = find(this.workspaces, { 'name': localStorage.getItem("currentWs") });
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
      const workspaces = await this.graphqlClient(query);
      this.workspaces = workspaces.myWorkspaces;
    }
    catch(error) {
      this.workspaces = null;
      throw(error);
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
        ws{
          id
          name
        }
      }
    }
    `;

    return this.graphqlClient(query);
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

    return this.graphqlClient(query);
  }

  getUserInfo = async() => {
    const query = `
    query Profile {
      profile{
        userId
        email
        firstName
        lastName
        phone
        position
      }
    }
    `;

    try {
      const user = await this.graphqlClient(query);
      this.user = user.profile;
    }
    catch(error) {
      this.user = null;
      throw(error);
      
    }
    return this.user;
  } 

  addHoliday = async ({title, date, officialHoliday}, id) => {
    const query = `
    mutation {
      addWorkspaceDate(
        name: "${title}", 
        wsId: ${id}, date: "${format(date)}", 
        isOfficialHoliday: ${officialHoliday}
      ) {
      ok
      }
    }
    `;

    return this.graphqlClient(query);
  }

  removeHoliday = async (id) => {
    const query = `
    mutation {
      removeWorkspaceDate(id: ${id}) {
        ok
      }
    }
    `;

    return this.graphqlClient(query);
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

    return this.graphqlClient(query);
  }  

  addWorkspaceMember = async (email, wsId, startDate) => {
    const query = `
    mutation {
      addWorkspaceMember(email: "${email}", wsId: ${wsId}, startDate: "${startDate}") {
        ok
      }
    }
    `;

    return this.graphqlClient(query);
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

    return this.graphqlClient(query);
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

    return this.graphqlClient(query);
  }

  removeWorkspaceMember = async (email, wsId) => {
    const query = `
    mutation {
      removeWorkspaceMember(email: "${email}", wsId: ${wsId},) {
        ok
      }
    }	
    `;

    return this.graphqlClient(query);
  }

  updateWorkspaceInfo = async ({name, description}, wsId) => {
    const query = `
    mutation {
      updateWorkspace(name: "${name}", description: "${description}", wsId: ${wsId},) {
        ok
      }
    }	
    `;

    return this.graphqlClient(query);
  }

  updateStartDate = async (wsId, userId, startDate) => {
    const query = `
    mutation {
      updateWorkspaceMember(wsId: ${wsId}, userId:${userId}, startDate:"${startDate}") {
         ok
       }
     }	
    `;

    return this.graphqlClient(query);
  }

  getWsOwner = async (id) => {
    const query = `
    {
      workspaceOwner(workspaceId:${id}) {
          userId
          email
        }
      }
    `;

    try {
      const owner = await this.graphqlClient(query);
      this.owner = owner.workspaceOwner;
    }
    catch(error) {
      this.owner = null;
     throw(error);
      
    }
    return this.owner;
  } 

  getVacationDays = async (wsId) => {
    const query = `
    query {
      teamCalendar(workspaceId: ${wsId}) {
        id
        userId
        startDate
        endDate
        leaveType
        approvedById
        comment
        user {
          email
          firstName
          lastName
        }
      }
    }
    `;

    return this.graphqlClient(query);
  }

  getMyBalance = async (wsId) => {
    const query = `
    query {
      myBalance(workspaceId: ${wsId}) {
        leftPaidLeaves
        leftUnpaidLeaves
        leftSickLeaves
        totalPaidLeaves
        totalUnpaidLeaves
        totalSickLeaves
      }
    }		
    `;

    return this.graphqlClient(query);
  }  

  createDayOff = async ({startDate, endDate, comment}, type, wsId) => {
    const query = `
    mutation {
      createDayOff(
          startDate: "${format(startDate)}", 
          endDate: "${format(endDate)}",
          type: "${type}",
          workspaceId:${wsId}, 
          comment: "${comment}"
      ){
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

    return this.graphqlClient(query);
  }

  getDaysOffForApproval = async (wsId) => {
    const query = `
    query {
      dayOffsForApproval(workspaceId: ${wsId}) {
        user{
          userId
          email
          firstName
          lastName
        }
        id
        startDate
        endDate
        leaveType
      }
    }		
    `;

    return this.graphqlClient(query);
  }  

  approveDayOff = async (dayOffId) => {
    const query = `
    mutation {
      approveDayOff(dayOffId:${dayOffId}){
        ok
      }
    }	
    `;

    return this.graphqlClient(query);
  }
}  

export default new profileService();