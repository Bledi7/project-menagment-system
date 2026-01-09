import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const loginUser = async (email, password, token) => {
  try {
    const response = await axios.post(
      `${apiUrl}/login`,
      {
        email,
        password,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data.user;
  } catch (error) {
    throw new Error("Failed to login.");
  }
};

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${apiUrl}/register`, userData);
    return response.data.user;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to register user.");
    }
  }
};

const getUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data.users;
  } catch (error) {
    throw new Error("Failed to fetch users.");
  }
};

const editUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${apiUrl}/users/${userId}`, userData);
    return response.data.user;
  } catch (error) {
    throw new Error("Failed to edit user.");
  }
};

const deleteUser = async (userId) => {
  try {
    await axios.delete(`${apiUrl}/users/${userId}`);
    return true;
  } catch (error) {
    throw new Error("Failed to delete user.");
  }
};

const apiApproveUser = async (userId) => {
  try {
    const response = await axios.put(`/users/${userId}/approve`);
    console.log("User approved:", response.data.message);
    return response.data;
  } catch (error) {
    console.error("Error approving user:", error);
    throw error;
  }
};

const apiDisapproveUser = async (userId) => {
  try {
    const response = await axios.put(`/users/${userId}/disapprove`);
    console.log("User disapproved:", response.data.message);
    return response.data;
  } catch (error) {
    console.error("Error disapproving user:", error);
    throw error;
  }
};

const createTeam = async (teamData) => {
  try {
    const response = await axios.post(`${apiUrl}/teams`, teamData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create team.");
  }
};

const editTeam = async (teamId, teamData) => {
  try {
    const response = await axios.put(`${apiUrl}/teams/${teamId}`, teamData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to edit team.");
  }
};

const deleteTeam = async (teamId) => {
  try {
    const response = await axios.delete(`${apiUrl}/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting team:", error);
    throw new Error("Failed to delete team.");
  }
};

const fetchTeams = async () => {
  try {
    const response = await axios.get(`${apiUrl}/teams`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch teams.");
  }
};

const fetchProjects = async () => {
  try {
    const response = await axios.get(`${apiUrl}/getProject`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch projects.");
  }
};

const getMessages = async () => {
  try {
    const res = await axios.get(`${apiUrl}/messages/1`);
    setMessages(res.data);
  } catch (error) {
    console.log(error);
  }
};

export {
  registerUser,
  loginUser,
  getUsers,
  editUser,
  deleteUser,
  apiApproveUser,
  apiDisapproveUser,
  createTeam,
  deleteTeam,
  editTeam,
  fetchTeams,
  fetchProjects,
  getMessages,
};
