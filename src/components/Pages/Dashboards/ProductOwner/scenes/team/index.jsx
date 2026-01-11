import { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Profile from "../../../../../Atoms/images/vali.jpg";

const Team = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleCreateTeam = () => {
    setShowSuccessMessage(true);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const handleOptionClick = (option) => {
    console.log("Selected option:", option);
  };

  const teams = [
    { id: 1, title: "Development Team", leads: 4, employees: 26 },
    { id: 2, title: "Design Team", leads: 3, employees: 20 },
    { id: 3, title: "Marketing Team", leads: 5, employees: 18 },
  ];

  return (
    <div style={{ margin: "30px" }}>
      {/* Top row: Teams, Leads, Employees, and Projects */}
      <Grid container spacing={2} textAlign="center" marginTop="10%">
        <Grid item xs={3}>
          <Card
            sx={{
              borderRadius: "20px",
              color: "#fff",
              background:
                "linear-gradient(0deg, hsla(170, 17%, 59%, 1) 0%, hsla(188, 54%, 39%, 1) 100%)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.5s ease, box-shadow 0.5s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                background: "#2E8A99",
              },
            }}
          >
            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: "600" }}>
                {" "}
                7
              </Typography>
              <Typography variant="subtitle2" sx={{ paddingTop: "20px" }}>
                Teams
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card
            sx={{
              borderRadius: "20px",
              color: "#fff",
              background:
                "linear-gradient(0deg, hsla(170, 17%, 59%, 1) 0%, hsla(188, 54%, 39%, 1) 100%)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.5s ease, box-shadow 0.5s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                background: "#2E8A99",
              },
            }}
          >
            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: "600" }}>
                {" "}
                15
              </Typography>
              <Typography variant="subtitle2" sx={{ paddingTop: "20px" }}>
                Leads
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card
            sx={{
              borderRadius: "20px",
              color: "#fff",
              background:
                "linear-gradient(0deg, hsla(170, 17%, 59%, 1) 0%, hsla(188, 54%, 39%, 1) 100%)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.5s ease, box-shadow 0.5s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                background: "#2E8A99",
              },
            }}
          >
            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: "600" }}>
                200
              </Typography>
              <Typography variant="subtitle2" sx={{ paddingTop: "20px" }}>
                Employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card
            sx={{
              borderRadius: "20px",
              color: "#fff",
              background:
                "linear-gradient(0deg, hsla(170, 17%, 59%, 1) 0%, hsla(188, 54%, 39%, 1) 100%)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.5s ease, box-shadow 0.5s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                background: "#2E8A99",
              },
            }}
          >
            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: "600" }}>
                35
              </Typography>
              <Typography variant="subtitle2" sx={{ paddingTop: "20px" }}>
                Projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Team card */}

      <Grid container spacing={2} marginTop="10%">
        <Grid item xs={3}>
          <Card
            sx={{
              padding: "10px",
              background:
                "linear-gradient(0deg, hsla(0, 0%, 100%, 1) 0%, hsla(188, 54%, 39%, 1) 100%)",
              borderRadius: "20px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
            }}
          >
            <CardContent>
              {showSuccessMessage ? (
                <div style={{ textAlign: "center", padding: "10px" }}>
                  <Typography variant="h6" paddingBottom="20px">
                    You have successfully created a team
                  </Typography>
                  <IconButton
                    onClick={handleCloseSuccessMessage}
                    sx={{ backgroundColor: "#fff" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <div>
                  <Typography
                    variant="h5"
                    color="#fff"
                    fontWeight="600"
                    paddingBottom="20px"
                  >
                    Create Team
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Add project"
                      InputProps={{
                        style: {
                          background: "#f9f9f9",
                          border: "none",
                          borderRadius: "2px",
                          padding: "0",
                          fontSize: "14px",
                        },
                      }}
                      sx={{ marginBottom: "10px" }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Add people"
                      InputProps={{
                        style: {
                          background: "#f9f9f9",
                          border: "none",
                          borderRadius: "2px",
                          padding: "0",
                          fontSize: "14px",
                        },
                      }}
                      sx={{
                        marginBottom: "10px",
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Add team"
                      InputProps={{
                        style: {
                          background: "#f9f9f9",
                          border: "none",
                          borderRadius: "2px",
                          padding: "0",
                          fontSize: "14px",
                        },
                      }}
                      sx={{ marginBottom: "15px" }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleCreateTeam}
                      sx={{
                        width: "100%",
                        borderRadius: "8px",
                      }}
                    >
                      Create
                    </Button>
                  </Box>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* Three wide cards for teams */}
        {teams.map((team) => (
          <Grid item xs={3} key={team.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "#fff",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                borderRadius: "20px",
                border: "1px solid #ecebeb",
                padding: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight="600" paddingBottom="20px">
                  {team.title}
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">Leads: {team.leads}</Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={Profile}
                    alt="Profile"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                    }}
                  />
                  <img
                    src={Profile}
                    alt="Profile"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                    }}
                  />
                  <img
                    src={Profile}
                    alt="Profile"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                    }}
                  />
                  <img
                    src={Profile}
                    alt="Profile"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <Typography variant="subtitle1">
                  Employees: {team.employees}
                </Typography>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={Profile}
                    alt="Profile"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                    }}
                  />
                  <img
                    src={Profile}
                    alt="Profile"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                    }}
                  />
                  <img
                    src={Profile}
                    alt="Profile"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                    }}
                  />
                  <img
                    src={Profile}
                    alt="Profile"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "auto",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#84A7A1",
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "15px",
                  }}
                  onClick={() => handleOptionClick("Edit")}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#FF0000",
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "15px",
                  }}
                  onClick={() => handleOptionClick("Delete")}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#1F6E8C",
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "15px",
                  }}
                  onClick={() => handleOptionClick("More")}
                >
                  More
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Team;
