import "../../../../Atoms/buttons/button.css";
import { ToDoItem } from "./ToDoItem";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useEffect } from "react";
import { format } from "timeago.js";
import {
  changeProjects,
  selectProjects,
} from "../../../../../redux/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
export function ProjectsDispalyCard({ projects, setSelectedProject }) {
  const dispatch = useDispatch();
  const getProjects = async () => {
    try {
      const result = await axios.get("http://localhost:4000/api/getProject");
      const formattedProjects = result.data.map((project) => ({
        ...project,
        isChecked: false,
        isFavorite: false,
      }));
      dispatch(changeProjects(formattedProjects));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProjects();
  }, [dispatch]);

  const projectsFromJira = useSelector(selectProjects);
  const projectsToMap = projectsFromJira.filter((objB) => {
    return projects.some((objA) => objA._id === objB._id);
  });
  // console.log(projectsToMap);
  // console.log(projects);
  // console.log(projectsFromJira);

  const selectProject = async (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="wrapper">
      <div>
        <span style={{ padding: "0px 10px" }}>Recent Activity</span>{" "}
        <div style={{ display: "grid", gap: "1rem", paddingTop: "1rem" }}>
          {projectsToMap.map((project) => (
            <div onClick={() => setSelectedProject(project)} key={project._id}>
              {" "}
              <ToDoItem
                time={format(project.startDate)}
                project={project.title}
                progress={project?.progress}
              />
            </div>
          ))}
        </div>
      </div>
      <Button variant="contained" size="small" id="viewMore-button">
        View All
        <AddRoundedIcon className="viewMoreIcon"></AddRoundedIcon>
      </Button>
    </div>
  );
}
