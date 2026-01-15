import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  createTeam,
  getUsers,
  fetchProjects as fetchProjectsFromAPI,
} from "../../../../../Atoms/helpers/api";

const CreateTeam = ({ onCreateTeam }) => {
  const [teamName, setTeamName] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formOpen, setFormOpen] = useState(true);

  const fetchProjects = async () => {
    try {
      const projectsData = await fetchProjectsFromAPI();
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleCreateTeam = async () => {
    try {
      const newTeamData = {
        title: teamName,
        project: selectedProject,
        leads: selectedLeads,
        employees: selectedEmployees,
      };

      const createdTeam = await createTeam(newTeamData);
      console.log("Team created:", createdTeam);

      onCreateTeam(createdTeam);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };
  const handleFormClose = () => {
    setFormOpen(false);
  };

  return (
    <div style={{ padding: "10px" }}>
      {formOpen && (
        <IconButton
          onClick={handleFormClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
      <Typography variant="h5" fontWeight="600" marginBottom="10px">
        Create Team
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: "10px" }}>
        <InputLabel>Select Project</InputLabel>
        <Select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projects.map((project) => (
            <MenuItem key={project._id} value={project._id}>
              {project.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: "10px" }}>
        <InputLabel>Select Employees ({selectedEmployees.length})</InputLabel>
        <Select
          multiple
          value={selectedEmployees}
          onChange={(e) => setSelectedEmployees(e.target.value)}
          renderValue={(selected) =>
            selected
              .map((userId) => {
                const user = users.find((user) => user._id === userId);
                return user ? `${user.firstName} ${user.lastName}` : "";
              })
              .join(", ")
          }
        >
          {users
            .filter((user) => user.role === "Developer")
            .map((user) => (
              <MenuItem key={user._id} value={user._id}>
                <Checkbox checked={selectedEmployees.indexOf(user._id) > -1} />
                <ListItemText primary={`${user.firstName} ${user.lastName}`} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: "10px" }}>
        <InputLabel>Select Leads ({selectedLeads.length})</InputLabel>
        <Select
          multiple
          value={selectedLeads}
          onChange={(e) => setSelectedLeads(e.target.value)}
          renderValue={(selected) =>
            selected
              .map((userId) => {
                const user = users.find((user) => user._id === userId);
                return user ? `${user.firstName} ${user.lastName}` : "";
              })
              .join(", ")
          }
        >
          {users
            .filter((user) => user.role === "Scrum Master")
            .map((user) => (
              <MenuItem key={user._id} value={user._id}>
                <Checkbox checked={selectedLeads.indexOf(user._id) > -1} />
                <ListItemText primary={`${user.firstName} ${user.lastName}`} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Add team"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        sx={{ marginBottom: "15px", fontSize: "5px" }}
      />
      <Button
        variant="contained"
        onClick={handleCreateTeam}
        sx={{ width: "50%", borderRadius: "8px" }}
      >
        Create
      </Button>
    </div>
  );
};

export default CreateTeam;
