import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setTeam } from "../../../redux/teamSlice";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { Add, ArrowBackIos } from "@mui/icons-material";
import Logo from "../../Atoms/images/logo.svg";
import  {SendEmailModal } from "./SendEmailModal";
import { useEffect } from "react";
const TeamMembers = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const teamData = location.state && location.state.teamData;
  dispatch(setTeam(teamData));

  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);

  const handleShowAddUserDialog = () => {
    setShowAddUserDialog(true);
  };

  const handleHideAddUserDialog = () => {
    setShowAddUserDialog(false);
    setSelectedUser(null);
  };

  const handleUserSelected = (user) => {
    setSelectedUser(user);
  };

  const handleAddUserToTeam = () => {
    if (selectedUser) {
      console.log(selectedUser);

      setSelectedUser(null);
      setShowAddUserDialog(false);
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //fix the dispatching
  useEffect(() => {
    if (teamData) {
      dispatch(setTeam(teamData));
    }
  }, [dispatch, teamData]);

  return (
    <div style={{ margin: "30px" }}>
      <Button
        startIcon={<ArrowBackIos />}
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          boxShadow: "0 3px 8px rgba(0, 0, 0, 0.25)",
          borderRadius: "20px",
          color: "#000",
          padding: "5px 12px",
          textTransform: "capitalized",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        Go Back
      </Button>
      <Paper
        elevation={3}
        style={{
          backgroundColor: "#fff",
          height: "70px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          justifyContent: "center",
          padding: "0px 30px",
          boxShadow: "0 3px 8px rgba(0, 0, 0, 0.25)",
          borderRadius: "20px",
          cursor: "pointer",
        }}
      >
        <div>
          <div>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              Team Members
            </Typography>
          </div>
          <div>
            <Typography
              variant="subtitle1"
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#cc0505",
              }}
            >
              Team: {teamData && teamData.title}
            </Typography>
          </div>
        </div>
        <Button
          // startIcon={<ArrowBackIos />}
          endIcon={<EmailOutlinedIcon />}
          style={{
            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.25)",
            borderRadius: "10px",
            color: "white",
            background: "#0b54fc",
            padding: "5px 12px",
            textTransform: "capitalized",
            alignItems: "center",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={handleOpen}
        >
          Send Email
        </Button>
      </Paper>

      <Grid container spacing={4} sx={{ paddingTop: "7%" }}>
        {/* dding a new team member */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper
            elevation={3}
            style={{
              cursor: "pointer",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              backgroundColor: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
            }}
            onClick={handleShowAddUserDialog}
          >
            <IconButton color="primary">
              <Add fontSize="large" />
            </IconButton>
            <Typography
              sx={{ fontSize: "18px", fontWeight: "600", paddingTop: "10px" }}
            >
              Add
            </Typography>
          </Paper>
        </Grid>

        {/* User Cards */}
        {teamData &&
          [...(teamData.leads || []), ...(teamData.employees || [])].map(
            (member, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <Paper
                  elevation={3}
                  style={{
                    padding: "50px 5px 5px 5px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                    borderRadius: "20px",
                  }}
                >
                  {/* Display user profile image */}
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      padding: "15px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <img src={Logo} alt="Profile" style={{ width: "100%" }} />
                  </div>

                  {/* Display user's full name, email, and role */}
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "600",
                      paddingTop: "30px",
                    }}
                  >
                    {member && member.firstName} {member && member.lastName}
                  </Typography>
                  <Typography sx={{ fontSize: "12px" }}>
                    {member.email}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      paddingTop: "15px",
                    }}
                  >
                    {member.role}
                  </Typography>

                  {/* Display action buttons */}
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        flex: "1",
                        textAlign: "left",
                        fontSize: "13px",
                        padding: "25px",
                      }}
                    >
                      Assign
                    </div>
                    <div
                      style={{ flex: "1", textAlign: "right", padding: "20px" }}
                    >
                      <Button
                        size="small"
                        sx={{
                          borderRadius: "20px",
                          background: "#0b54fc",
                          color: "white",
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Paper>
              </Grid>
            )
          )}
      </Grid>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onClose={handleHideAddUserDialog}>
        <DialogTitle>Select User to Add</DialogTitle>
        <DialogActions>
          <Button onClick={handleHideAddUserDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddUserToTeam} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <SendEmailModal open={open} handleClose={handleClose}></SendEmailModal>
    </div>
  );
};

export default TeamMembers;
