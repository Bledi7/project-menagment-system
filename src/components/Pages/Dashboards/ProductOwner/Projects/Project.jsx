
//Project
import { useState, useEffect } from "react";
import {
  Select,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  MenuItem,
  Button,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import "./Projects.css";
import ProfileImg from "../../../../Atoms/images/ProfileImg.jpg.png";
import SecondProfileImg from "../../../../Atoms/images/vali.jpg";
import { useNavigate } from 'react-router';
import CreateProject from "./CreateProject";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CreateTrelloProject from "./CreateTrelloProject";


const calculateProgress = (statistics) => {
  const { inToDo, inProgress, inDone } = statistics;
  const totalTasks = inToDo + inProgress + inDone;

  // To avoid division by zero if totalTasks is 0
  if (totalTasks === 0) return 0;
  if (inDone === 0) return 0;
  console.log('inToDo', inToDo)
  console.log('inProgress', inProgress)
  console.log('inDone', inDone)
  const progress = (inDone / totalTasks) * 100;
  return Math.round(progress);
};


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [updateProject, setUpdateProject] = useState({
    title: "",
    status: "",
    startDate: "",
    key: "",
    listId: "",
    boardId: ""
  });

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(
    false
  );
  const [isCreateTrelloProjectTModalOpen, setIsCreateTrelloProjectModalOpen] = useState(
    false
  );


  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    try {
      const result = await axios.get("http://localhost:4000/api/getProject");
      const formattedProjects = result.data.map((project) => ({
        ...project,

      }));
      setProjects(formattedProjects);
    } catch (error) {
      console.error(error);
    }
  };

  const [projectStatistics, setProjectStatistics] = useState([]);

  useEffect(() => {
    const fetchStatistics = async (projectKey) => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/statistics/${projectKey}`
        );
        setProjectStatistics((prevStats) => ({
          ...prevStats,
          [projectKey]: response.data,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTrelloStatistics = async (boardId) => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/numberOfCards/${boardId}`
        );
        console.log('response.data', response.data)
        setProjectStatistics((prevStats) => ({
          ...prevStats,
          [boardId]: response.data,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    projects.forEach((project) => {
      if (project.boardId)
        fetchTrelloStatistics(project.boardId);
      else {
        fetchStatistics(project.key);
      }
    });
  }, [projects]);



  const handleProjectAdded = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleOpen = (projectId) => {
    const selectedProject = projects.find(
      (project) => project._id === projectId
    );
    setUpdateProject({
      title: selectedProject.title,
      status: selectedProject.status,
      startDate: selectedProject.startDate,
      key: selectedProject.key,
      boardId: selectedProject.boardId,
      listId: selectedProject.listId,
    });
    setOpen(true);
    setSelectedProjectId(projectId);
  };

  const handelOpenDeleteModal = (projectId) => {
    setOpenDeleteModal(true);
    setSelectedProjectId(projectId);
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedProjectId("");
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedProjectId("");
  };  // Function to open the modal
  const handleOpenCreateProjectModal = () => {
    setIsCreateProjectModalOpen(true);
  }
  const handleOpenCreateTrelloProjectModal = () => {
    setIsCreateTrelloProjectModalOpen(true);

  };

  // Function to close the modal
  const handleCloseCreateProjectModal = () => {
    setIsCreateProjectModalOpen(false);
  };

  const handleCloseCreateTrelloProjectModal = () => {
    setIsCreateTrelloProjectModalOpen(false);
  };

  const handleUpdateProject = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/updateProject/${selectedProjectId}`,
        updateProject
      );
      // Refresh the projects list
      getProjects();
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/deleteProject/${selectedProjectId}`
      );
      // Refresh the projects list
      getProjects();
      handleCloseDeleteModal();
    } catch (error) {
      console.error(error);
    }
  };
  const compareDates = (project1, project2) => {
    const date1 = new Date(project1.startDate);
    const date2 = new Date(project2.startDate);
    return date2 - date1; // Compare in reverse order for newest first
  };

  // Function to sort by latest date
  const sortByNewestDate = () => {
    const sortedProjects = [...projects].sort(compareDates);
    setProjects(sortedProjects);
  };

  // Function to sort by newest date
  const sortByLatestDate = () => {
    const sortedProjects = [...projects].sort((project1, project2) => compareDates(project2, project1));
    setProjects(sortedProjects);

  };
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>


      <section style={{ backgroundColor: "#f7f6f6" }}>
        <div style={{ margin: "0", padding: "0", width: "100%" }}>
          <div>
            <TextField
              type="text"
              value={searchTerm}
              sx={{ width: "20%", marginLeft: "11%" }}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title"
              variant="outlined"
              fullWidth
            />

            <Button
              sx={{ mt: 5, p: 1, margin: "0% 0% 0% 30.5%", width: "15%" }}

              variant="outlined"
              onClick={handleOpenCreateProjectModal} // Open the modal when the button is clicked
            >
              Create new project (Jira)
            </Button>
            <Button
              sx={{ mt: 5, p: 1, margin: "0% 0% 0% 61.5%", width: "15%" }}

              variant="outlined"
              onClick={handleOpenCreateTrelloProjectModal} // Open the modal when the button is clicked
            >
              Create new project(Trello)
            </Button>
            <div className="search-bar">



            </div>

          </div>

          <div style={{ display: "flex", alignItems: "center", margin: "5% 0% 0% 10%" }}>
            <Typography variant="h6" component="h6" style={{

              marginRight: "5%",
              marginLeft: "2%",
              marginBottom: "2%",


            }}>
              Sort by date
            </Typography>
            <Button
              sx={{
                marginBottom: "2%",
                color: "black"
              }}
              variant="outlined"
              className="sort-buttons"
              onClick={sortByLatestDate}
            >
              Oldest Date Projects <ArrowDownwardIcon sx={{ color: "black" }} />
            </Button>
            <Button
              sx={{
                marginLeft: "2%",
                marginBottom: "2%",
                color: "black"
              }}
              variant="outlined"
              onClick={sortByNewestDate}
              className="sort-buttons"
            >
              Newest date Projects <ArrowUpwardIcon sx={{ color: "black" }} />
            </Button>
          </div>


          <Container
            sx={{
              color: "text.primary",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              width: "100%",
              marginLeft: "8%",
              marginRight: "10%"
            }}
          >
            {projects.filter((project) => project.title.toLowerCase().startsWith(searchTerm.toLowerCase()))
              .map((project) => {
                const isJiraProject = !!project.key;
                return (
                  <Card
                    key={project.id}
                    sx={{
                      marginBottom: "20px",
                      marginLeft: "2%",
                      flex: {
                        xs: "100%",
                        sm: "100%",
                        md: "0 0 33%",
                        lg: "0 0 32%",
                        xl: "0 0 30%",
                      },
                    }}
                  >
                    <CardContent>
                      <div style={{ display: "flex", alignItems: "flex-left" }}>
                        <div style={{ width: "100%" }}>
                          <div
                            style={{
                              minWidth: "30%",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "left",
                              marginBottom: 3,
                            }}
                          >
                            <div>
                              <Typography
                                variant="h6"
                                component="h6"
                                sx={{
                                  color: "primary.main",
                                  fontWeight: "bold",
                                  mb: 0,
                                  fontSize: "16px",
                                  marginTop: "3%",
                                }}
                              >
                                {project.title}
                              </Typography>
                            </div>
                            <div>
                              <IconButton
                                aria-label="edit"
                                onClick={() => handleOpen(project._id)}
                              >
                                <EditIcon sx={{ fontSize: "18px" }} />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                onClick={() => handelOpenDeleteModal(project._id)}
                              >
                                <DeleteIcon sx={{ fontSize: "18px" }} />
                              </IconButton>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "start",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "start",
                              }}
                            >
                              <Typography
                                variant="body2"
                                component="p"
                                sx={{
                                  color:
                                    project.status === "Inactive"
                                      ? "#FF4371"
                                      : project.status === "On Hold"
                                        ? "#F2B705"
                                        : "#1AD993",
                                  mb: 0,
                                  fontWeight: "bold",
                                }}
                              >
                                • {project.status}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="p"
                                sx={{ color: "#949AA4", mt: 3 }}
                              >
                                Start Date
                                <br />
                                {formatDate(project.startDate)}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="p"
                                sx={{ marginTop: "15%" }}
                              >
                                Members
                              </Typography>
                              <div style={{ display: "flex", flexDirection: "row" }}>
                                <Avatar src={ProfileImg} alt="avatar" sx={{ ml: 0 }} />
                                <Avatar
                                  src={SecondProfileImg}
                                  alt="avatar"
                                  sx={{ ml: 0 }}
                                />
                                <Avatar src={ProfileImg} alt="avatar" sx={{ mr: 3 }} />
                              </div>
                            </div>
                            <div>
                              <div>

                                <Button
                                  sx={{ mt: 7, p: 1 }}
                                  variant="outlined"
                                  onClick={() =>
                                    navigate(`/projectDashboard/${project.key ? project.key : project.boardId}/${isJiraProject ? 'jira' : 'trello'}`)
                                  }
                                >
                                  View More Details
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div style={{ marginTop: "10px" }}>
                            {project.key ? (
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: "5%",
                                  }}
                                >
                                  {projectStatistics[project.key] ? (
                                    <Typography variant="body2" component="p">
                                      {calculateProgress(projectStatistics[project.key])}%
                                    </Typography>
                                  ) : (
                                    <Typography variant="body1"></Typography>
                                  )}
                                </div>

                                <div style={{ marginTop: "5%", backgroundColor: "black" }}>
                                  {projectStatistics[project.key] ? (
                                    <LinearProgress
                                      variant="determinate"
                                      value={calculateProgress(projectStatistics[project.key])}
                                      sx={{
                                        width: "100%",
                                        "& .MuiLinearProgress-bar": {
                                          backgroundColor: "#1AD993",
                                        },
                                        "& .MuiLinearProgress-root": {
                                          backgroundColor: "grey",
                                        },
                                      }}
                                    />
                                  ) : (
                                    <Typography variant="body1"></Typography>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: "5%",
                                  }}
                                >
                                  {projectStatistics[project.boardId] ? (
                                    <Typography variant="body2" component="p">
                                      {calculateProgress(projectStatistics[project.boardId])}%
                                    </Typography>
                                  ) : (null
                                  )}
                                </div>

                                <div style={{ marginTop: "5%", backgroundColor: "black" }}>
                                  {projectStatistics[project.boardId] ? (
                                    <LinearProgress
                                      variant="determinate"
                                      value={calculateProgress(projectStatistics[project.boardId])}
                                      sx={{
                                        width: "100%",
                                        "& .MuiLinearProgress-bar": {
                                          backgroundColor: "#1AD993",
                                        },
                                        "& .MuiLinearProgress-root": {
                                          backgroundColor: "grey",
                                        },
                                      }}
                                    />
                                  ) : (
                                    <Typography variant="body1"></Typography>
                                  )}
                                </div>
                              </div>
                            )}


                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </Container>
        </div>
        <Modal
          open={isCreateProjectModalOpen}
          onClose={handleCloseCreateProjectModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <CreateProject onProjectAdded={handleProjectAdded} />
          </Box>
        </Modal>
        <Modal
          open={isCreateTrelloProjectTModalOpen}
          onClose={handleCloseCreateTrelloProjectModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <CreateTrelloProject onProjectAdded={handleProjectAdded} />
          </Box>
        </Modal>
        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ marginBottom: "1rem" }}
            >
              Update Project
            </Typography>
            <TextField
              label="Title"
              value={updateProject.title}
              onChange={(e) =>
                setUpdateProject({ ...updateProject, title: e.target.value })
              }
              fullWidth
              sx={{ marginBottom: "1rem" }}
            />
            <label htmlFor="status">Check one of the status below:</label>
            <Select
              name="status"
              value={updateProject.status}
              onChange={(e) =>
                setUpdateProject({ ...updateProject, status: e.target.value })
              }
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{ marginBottom: "1rem" }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="On Hold">On Hold</MenuItem>
            </Select>
            <TextField
              label="Start Date"
              value={updateProject.startDate}
              onChange={(e) =>
                setUpdateProject({ ...updateProject, startDate: e.target.value })
              }
              fullWidth
              sx={{ marginBottom: "1rem" }}
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            {(updateProject.key) ? (
              <TextField
                label="Key"
                value={updateProject.key}
                onChange={(e) => setUpdateProject({ ...updateProject, key: e.target.value })}
                fullWidth
                sx={{ marginBottom: '1rem' }}
                InputProps={{
                  readOnly: true,
                }}
              />) : (
              <div>

                <TextField
                  label="BoardId"
                  value={updateProject.boardId}
                  onChange={(e) => setUpdateProject({ ...updateProject, boardId: e.target.value })}
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="List Id"
                  value={updateProject.listId}
                  onChange={(e) => setUpdateProject({ ...updateProject, listId: e.target.value })}
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
            )
            }

            <Button variant="contained" onClick={handleUpdateProject}>
              Update
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseModal}
              sx={{ marginLeft: "0.5rem" }}
            >
              Cancel
            </Button>
          </Box>
        </Modal>
        <Modal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Are you sure that you want to delete this project ?
            </Typography>

            <Button
              variant="contained"
              onClick={handleCloseDeleteModal}
              sx={{ marginLeft: "0.5rem", top: "50%", left: "30%" }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={handleDeleteProject}
              sx={{
                marginLeft: "0.5rem",
                backgroundColor: "#FF4371",
                color: "white",
                top: "50%",
                left: "30%",
                "&:hover": {
                  backgroundColor: "#FF4371",
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </Modal>
      </section>
    </div>
  );
};

export default Projects;