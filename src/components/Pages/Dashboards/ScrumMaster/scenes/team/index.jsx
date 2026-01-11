import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";
import CreateTeam from "./createTeam";
import { useSelector, useDispatch } from "react-redux";
import { updateTeams } from "../../../../../../redux/teamSlice";
import { fetchTeams, deleteTeam } from "../../../../../Atoms/helpers/api";

const Team = ({ onTeamCreated }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const teams = useSelector((state) => state.teams);

  const handleOptionClick = (team) => {
    console.log("Selected option:", team);
    navigate("/teammembers", { state: { teamData: team } });
  };

  const handleCreateTeam = async (newTeam) => {
    dispatch(updateTeams([...teams, newTeam]));
  };

  useEffect(() => {
    fetchTeams()
      .then((fetchedTeams) => {
        dispatch(updateTeams(fetchedTeams));
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, [dispatch]);

  const handleDelete = async (teamId) => {
    try {
      await deleteTeam(teamId);

      const updatedTeams = teams.filter((team) => team._id !== teamId);
      onTeamCreated(updatedTeams);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ margin: "30px" }}>
      <Paper
        elevation={3}
        style={{
          backgroundColor: "#fff",
          height: "70px",
          width: "100%",
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          flexDirection: "column",
          padding: "0px 30px",
          boxShadow: "0 3px 5px rgba(0, 0, 0, 0.25)",
          borderRadius: "20px",
        }}
      >
        <div>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            Teams
          </Typography>
        </div>
      </Paper>
      {/* Top row */}
      <Grid container spacing={2} textAlign="center" marginTop="20px">
        <Grid item xs={3}>
          <Card
            sx={{
              borderRadius: "20px",
              color: "#000",
              background: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.5s ease, box-shadow 0.5s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                background: "#2E8A99",
                color: "#fff",
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
              color: "#000",
              background: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.5s ease, box-shadow 0.5s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                background: "#2E8A99",
                color: "#fff",
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
              color: "#000",
              background: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.5s ease, box-shadow 0.5s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                background: "#2E8A99",
                color: "#fff",
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
              color: "#000",
              background: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.5s ease, box-shadow 0.5s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                background: "#2E8A99",
                color: "#fff",
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
        <Grid item xs={6}>
          <Card
            sx={{
              padding: "10px",
              background: "#cecece",
              borderRadius: "20px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.24)",
            }}
          >
            <CardContent>
              <CreateTeam onCreateTeam={handleCreateTeam} />
            </CardContent>
          </Card>
        </Grid>

        {/* Teams Cards */}
        {teams.map((team) => (
          <Grid item xs={3} key={team._id}>
            {" "}
            {console.log(team)}
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
                <Typography
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    paddingBottom: "20px",
                  }}
                >
                  Project: {team.project ? team.project.title : "No Project"}
                </Typography>
                <Typography
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    paddingBottom: "20px",
                  }}
                >
                  Leads: {team.leads.length}
                </Typography>
                <Typography
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    paddingBottom: "20px",
                  }}
                >
                  Employees: {team.employees.length}
                </Typography>
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
                    backgroundColor: "#FF0000",
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "15px",
                  }}
                  onClick={() => handleDelete(team._id)}
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
                  onClick={() => handleOptionClick(team)}
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
