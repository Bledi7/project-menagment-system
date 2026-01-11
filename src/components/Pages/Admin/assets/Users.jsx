import { useEffect, useState } from "react";
import {
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  Pagination,
  Box,
} from "@mui/material";
import { Edit, Delete, CheckCircle, Cancel } from "@mui/icons-material";
import { getUsers, editUser, deleteUser } from "../../../Atoms/helpers/api";
import { useDispatch } from "react-redux";
// import { userStatus } from "../../../../redux/userSlice";

const Users = ({ users, onUserCreated }) => {
  const [newPassword, setNewPassword] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const [page, setPage] = useState(1);
  const usersPerPage = 5;
  const [selectedUser, setSelectedUser] = useState(null);

  const dispatch = useDispatch();

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      onUserCreated(usersData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      setEditedUser(userToEdit);
      setEditUserId(userId);
      setEditUserDialogOpen(true);
    }
  };

  const handleEditUserDialogClose = () => {
    setEditUserDialogOpen(false);
    setEditedUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    });
    setEditUserId(null);
  };

  const handleEditUser = async (userId) => {
    try {
      const updatedUser = { ...editedUser };
      if (newPassword) {
        updatedUser.password = newPassword;
      }

      await editUser(userId, updatedUser);

      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, ...updatedUser } : user
      );
      onUserCreated(updatedUsers);
      handleEditUserDialogClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);

      const updatedUsers = users.filter((user) => user.id !== userId);
      onUserCreated(updatedUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      dispatch(userStatus({ userId, status: true }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisapprove = async (userId) => {
    try {
      dispatch(userStatus({ userId, status: false }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  


  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);

  return (
    <Box overflowX="auto">
      <Paper
        elevation={3}
        style={{
          // marginTop: "10px",
          backgroundColor: "#fff",
          // marginBottom: "10px",
          margin: "20px 0px",
          padding: "0",
        }}
      >
        <Box p={2}>
          <Box
            mb={2}
            display="flex"
            alignItems="center"
            fontWeight="bold"
            fontSize={14}
            paddingLeft="5px"
          >
            <Box flex={1}>ID</Box>
            <Box flex={3}>Name</Box>
            <Box flex={3}>Email</Box>
            <Box flex={2}>Role</Box>
            <Box flex={2}>Status</Box>
            <Box flex={1}>Actions</Box>
          </Box>

          {displayedUsers.map((user, index) => (
            <Box
              key={user.id}
              mb={index === displayedUsers.length - 1 ? 0 : 2}
              border="1px solid #ccc"
              paddingLeft="5px"
              display="flex"
              alignItems="center"
              fontSize={14}
            >
              <Box flex={1}>{user.id}</Box>
              <Box flex={3}>
                {user.firstName} {user.lastName}
              </Box>
              <Box flex={3}>{user.email}</Box>
              <Box flex={2}>{user.role}</Box>
              <Box flex={3} display="flex">
                <Box flex={1}>{user.status}</Box>
                <Box flex={10} display="flex">
                  <IconButton
                    disabled={user.status}
                    onClick={() => handleApprove(user._id)}
                  >
                    <CheckCircle fontSize="small" />
                  </IconButton>
                  <IconButton
                    disabled={user.status}
                    onClick={() => handleDisapprove(user._id)}
                  >
                    <Cancel fontSize="small" />
                  </IconButton>
                </Box>
                <Box flex={6} display="flex">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(user.id)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        style={{
          marginTop: "5px",
          marginBottom: "5px",
          display: "flex",
          justifyContent: "center",
        }}
      />

      <Dialog
        open={editUserDialogOpen}
        onClose={handleEditUserDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={editedUser.firstName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={editedUser.lastName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="New Password"
                name="newPassword"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                type="password"
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                label="Role"
                name="role"
                value={editedUser.role}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Product Owner">Product Owner</MenuItem>
                <MenuItem value="Scrum Master">Scrum Master</MenuItem>
                <MenuItem value="Developer">Developer</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleEditUserDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleEditUser(editUserId)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
