import { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function CreateProject({ onProjectAdded }) {
  const [project, setProject] = useState({
    title: "",
    status: "",
    startDate: "",

    key: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/api/createProject", project)
      .then((response) => {
        setSuccessMessage("Project has been created successfully!");
        onProjectAdded(response.data); // Notify the parent component (Projects) about the new project
        setProject({
          title: "",
          status: "",
          startDate: "",
          key: "",
          cardId: "",
          boardId: ""
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div>
      <div>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <div>
            <h2>Create Project</h2>
            {successMessage && (
              <Stack sx={{ mb: 2 }} spacing={2}>
                <Alert
                  severity="success"
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    padding: "1rem",
                    transition: "opacity 0.5s ease-in-out",
                    opacity: successMessage ? 1 : 0,
                  }}
                >
                  {successMessage}
                </Alert>
              </Stack>
            )}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <TextField
                label="Title"
                name="title"
                value={project.title}
                onChange={handleChange}
                style={{ width: "400px" }}
                margin="normal"
                variant="outlined"
                multiline
                rows={1}
              />
   

                <TextField
                  label="Key"
                  name="key"
                  value={project.key}
                  onChange={handleChange}
                  style={{ width: "400px" }}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={1}
                />

              

              <label htmlFor="status">Check one of the status below:</label>
              <Select
                name="status"
                value={project.status}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
              </Select>
              <TextField
                label="Date"
                name="startDate"
                value={project.startDate}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
              />

              <Button type="submit" variant="contained" color="secondary">
                Submit
              </Button>
            </form>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default CreateProject;
