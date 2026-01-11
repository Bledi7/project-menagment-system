import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import AdminHeader from "./Header";
import Users from "./assets/Users";
import CreateUser from "./assets/CreateUser";
import { getUsers } from "../../Atoms/helpers/api";

import "./admin.css";

const Admin = () => {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserCreated = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setIsCreateUserOpen(false);
  };

  const handleCreateUser = () => {
    setIsCreateUserOpen(true);
  };

  const handleCloseCreateUser = () => {
    setIsCreateUserOpen(false);
  };

  return (
    <Box display="flex">
      <Box flexGrow={1} className="admin-container">
        <AdminHeader handleCreateUser={handleCreateUser} />
        <Users users={users} onUserCreated={setUsers} />
      </Box>
      {isCreateUserOpen && (
        <CreateUser
          handleClose={handleCloseCreateUser}
          onUserCreated={handleUserCreated}
        />
      )}
    </Box>
  );
};

export default Admin;
