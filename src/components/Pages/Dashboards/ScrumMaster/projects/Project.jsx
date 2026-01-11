import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import "./Projects.css";
import ProfileImg from "../../../../Atoms/images/ProfileImg.jpg.png";
import SecondProfileImg from "../../../../Atoms/images/vali.jpg";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    try {
      const result = await axios.get("http://localhost:4000/api/getProject");
      const formattedProjects = result.data.map((project) => ({
        ...project,
        isChecked: false,
        isFavorite: false,
      }));
      setProjects(formattedProjects);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <section style={{ backgroundColor: "#f7f6f6" }}>
      <Container
        sx={{
          color: "text.primary",
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          marginTop: "5%",
          marginLeft: "5%",
        }}
      >
        {projects.map((project) => (
          <Card
            key={project.id} // Assuming there's an ID field in the report object
            sx={{
              width: "30%",
              height: "40%",
              marginBottom: "20px",
              marginLeft: "2%",
            }}
          >
            <CardContent>
              <div style={{ display: "flex", alignItems: "flex-left" }}>
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      width: "100%",
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
                        onClick={() => console.log("Edit clicked")}
                      >
                        <EditIcon sx={{ fontSize: "18px" }} />
                      </IconButton>
                      <IconButton
                        aria-label="more"
                        aria-controls="icon-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        <MoreVertIcon sx={{ fontSize: "18px" }} />
                      </IconButton>
                      <Menu
                        id="icon-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleClose}>Option 1</MenuItem>
                        <MenuItem onClick={handleClose}>Option 2</MenuItem>
                        <MenuItem onClick={handleClose}>Option 3</MenuItem>
                      </Menu>
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
                      <Button sx={{ mt: 6 }} variant="outlined">
                        View More Detail
                      </Button>
                    </div>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "5%",
                      }}
                    >
                      <Typography variant="body2" component="p">
                        Progress
                      </Typography>
                      <Typography variant="body2" component="p">
                        {project.progress}%
                      </Typography>
                    </div>

                    <div style={{ marginTop: "5%", backgroundColor: "black" }}>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
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
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </Container>
    </section>
  );
};

export default Projects;
