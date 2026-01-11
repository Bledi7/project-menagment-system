import { Grid } from "@mui/material";
import React from "react";
import { PieChartComponent } from "./Components/PieChartComponent";
import { BarChartComponent } from "./Components/BarChartComponent";
import { BarChartComponent2 } from "./Components/BarChartComponent2";
import CircularProgress from '@mui/material/CircularProgress';
import { UsersGrid } from "./Components/UsersGrid";
import { Budget } from "./Components/Budget";
import Calendar from "./Components/Calendar/Calendar";
import SchedulerComponent from "./Components/SchedulerComponent";
import "./projectDashboard.css";
import axios from "axios";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const ProjectDashboard = () => {
  const [data, setData] = useState(null);
  const { projectKey, isJiraProject } = useParams();
  const accessToken = useSelector((state) => state.accessToken);
  useEffect(() => {

    if (isJiraProject === "jira") {
      const fetchData = async () => {
        try {

          const headers = {
            Authorization: accessToken,
          };

          const response = await axios.get(
            `http://localhost:4000/api/statistics/${projectKey}`,
            {
              headers: headers,
            }
          );

          setData(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    } else if (isJiraProject === "trello") {
      const fetchJiraData = async () => {
        try {

          const headers = {
            Authorization: accessToken,
          };

          const response = await axios.get(
            `http://localhost:4000/api/combinedStats/${projectKey}`,
            {
              headers: headers,
            }
          );

          setData(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchJiraData();
    }




  }, [projectKey]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        padding: "20px",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={8.5}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div
                style={{
                  fontSize: "25px",
                  fontWeight: "600",
                  marginBottom: "20px",
                }}
              >
                Dashboard
              </div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ paddingLeft: "82%" }}>This Week</div>
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid container item xs={12} spacing={3} style={{ height: "auto" }}>
              <Grid item xs={12} md={5.7}>
                {data ? <PieChartComponent data={data} /> : <p>Loading ...   <CircularProgress
                  color="primary"
                  size={30}
                  thickness={5}
                  sx={{marginTop:'2%'}}
                /></p>}
              </Grid>
              <Grid container item xs={12} md={6.3} spacing={3}>
                <Grid item xs={12}>
                  {data ? (
                    <BarChartComponent2
                      text={"Total hours spent"}
                      percentage={"15.40"}
                      hours={"21h 35m"}
                      icon={"up"}
                      data={data}
                    />
                  ) : (
                    <p></p>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {data ? (
                    <BarChartComponent
                      text={"Total hours spent"}
                      percentage={"15.40"}
                      hours={"21h 35m"}
                      icon={"down"}
                      data={data}
                    />
                  ) : (
                    <p></p>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={3} className="secondRow">
              <Grid item xs={12} md={5.7}>
                <Budget />
              </Grid>
              <Grid item xs={12} md={6.3}>
                <UsersGrid></UsersGrid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3.5} style={{ height: "700px" }}>
          <div style={{ boxShadow: "  0px 0px 12px 5px #e9e8e8 " }}>
            <Calendar />
            <SchedulerComponent />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProjectDashboard;
