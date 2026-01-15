import { Grid } from "@mui/material";
import "./DevDashboardMain.css";
import {
  DevPageCardItem,
  TimeDisplayer,
  TimeTracker,
} from "../DeveloperMainComponentItems/DevPageCardItem";
import HistoryIcon from "@mui/icons-material/History";
import { DevPageImgItem } from "../DeveloperMainComponentItems/DevPageImgItem";
import { ProjectsDispalyCard } from "../DeveloperMainComponentItems/ProjectsDisplayCard";
import { ToDoCard } from "../DeveloperMainComponentItems/ToDoCard";
import { MembersCard } from "../DeveloperMainComponentItems/MembersCard";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

import DateRangeIcon from "@mui/icons-material/DateRange";
import Chat from "../Chat/Chat";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function DevDashboardMain() {
  const [currentChat, setCurrentChat] = useState();
  const [teams, setTeams] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const user = useSelector((state) => state.user);
  useEffect(() => {
    const fetchTeamsByLead = async () => {
      const employeeId = user._id;
      //use employeeId instead of static id
      const apiUrl = `http://localhost:4000/api/teams/of-employee?employeeId=${employeeId}`;
      try {
        const response = await axios.get(apiUrl);
        console.log(response.data);
        setTeams(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchTeamsByLead();
  }, [user]);

  const projects = teams.map((team) => team.project);

  useEffect(() => {
    console.log(teams);
    const project = teams.find(
      (item) => item.project._id === selectedProject._id
    );
    console.log(project);
    setSelectedEmployees(project?.employees);
  }, [selectedProject, teams]);

  return (
    <div className="devDashboardWrapper">
      <Grid
        container
        columnSpacing={{ xs: 2, md: 4 }}
        rowSpacing={{ xs: 2, md: 4 }}
        className="main-grid-container"
      >
        <Grid
          className="grid-card"
          container
          item
          columnSpacing={{ xs: 2, sm: 15, md: 30 }}
          xs={12}
          paddingBottom={"3%"}
        >
          <Grid className="grid-card" item xs={12} sm={6}>
            <TimeDisplayer></TimeDisplayer>{" "}
          </Grid>
          <Grid className="grid-card" item xs={12} sm={6}>
            <TimeTracker></TimeTracker>
          </Grid>
        </Grid>
        <Grid className="grid-card" item xs={12} sm={4}>
          <DevPageCardItem
            icon={DateRangeIcon}
            text={"Weekly activity"}
            numbertext={"2%"}
          />
        </Grid>
        <Grid className="grid-card" item xs={12} sm={4}>
          <DevPageCardItem
            icon={HistoryIcon}
            text={"Worked this Week"}
            numbertext={"40:00:05"}
          />
        </Grid>
        <Grid className="grid-card" item xs={12} sm={4}>
          <DevPageCardItem
            icon={FolderOutlinedIcon}
            text={"Project Worked"}
            numbertext={"07"}
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          className="third-grid-container"
          columnSpacing={{ xs: 2, md: 4 }}
          rowSpacing={{ xs: 2 }}
        >
          <Grid className="grid-card" item xs={12} md={6}>
            <DevPageImgItem></DevPageImgItem>
          </Grid>
          <Grid className="grid-card" item xs={12} md={6}>
            <ProjectsDispalyCard
              projects={projects}
              setSelectedProject={setSelectedProject}
            ></ProjectsDispalyCard>
          </Grid>
        </Grid>
        <Grid className="grid-card" item xs={12} md={6}>
          <MembersCard
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            employees={selectedEmployees}
          ></MembersCard>{" "}
        </Grid>
        <Grid className="grid-card" item xs={12} md={6}>
          <ToDoCard></ToDoCard>
        </Grid>
      </Grid>
      {currentChat ? (
        <Chat currentChat={currentChat} setCurrentChat={setCurrentChat} />
      ) : (
        <></>
      )}
    </div>
  );
}
