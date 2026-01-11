import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { getUsers, editUser } from "../../Atoms/helpers/api";
import { Check, Clear } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateUserStatus } from "../../../../redux/userSlice"; // Update path

const Requests = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        dispatch(setUser(usersData)); // Dispatch the updated user data
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (user) => {
    try {
      await editUser(user._id, { status: "approve" });
      dispatch(updateUserStatus({ userId: user._id, status: "approve" }));
    } catch (error) {
      console.error("Failed to approve user", error);
    }
  };

  const handleDisapprove = async (user) => {
    try {
      await editUser(user._id, { status: "reject" });
      dispatch(updateUserStatus({ userId: user._id, status: "reject" }));
    } catch (error) {
      console.error("Failed to disapprove user", error);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Requests
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Approval</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleApprove(user)}
                  disabled={user.status === "approve"}
                >
                  <Check color={user.status === "approve" ? "primary" : "action"} />
                </IconButton>
                <IconButton
                  onClick={() => handleDisapprove(user)}
                  disabled={user.status === "reject"}
                >
                  <Clear color={user.status === "reject" ? "error" : "action"} />
                </IconButton>
              </TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onChange={(event) => {
                    const role = event.target.value;
                    const updatedUser = { ...user, role };
                    editUser(user.id, updatedUser);
                    dispatch(updateUserStatus({ userId: user._id, status: user.status }));
                  }}
                >
                  <MenuItem value="Product Owner">Product Owner</MenuItem>
                  <MenuItem value="Scrum Master">Scrum Master</MenuItem>
                  <MenuItem value="Developer">Developer</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Requests;
