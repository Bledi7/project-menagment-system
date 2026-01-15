import * as React from "react";
import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import "./scheduler.css";
import {
  Scheduler,
  DayView,
  Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";

const currentDate = "2018-11-01";
const schedulerData = [
  {
    startDate: "2018-11-01T09:45",
    endDate: "2018-11-01T11:00",
    title: "Meeting",
  },
  {
    startDate: "2018-11-01T09:45",
    endDate: "2018-11-01T11:00",
    title: "Meeting",
  },
];

const SchedulerComponent = () => {
  return (
    <Paper
      className="schedulerPaper"
      style={{
        height: "413px",
        width: "320px",
        borderRadius: "3px",
        boxShadow: "none",
      }}
    >
      <Scheduler data={schedulerData}  className="ttess">
        <ViewState currentDate={currentDate}  />
        <DayView startDayHour={9} endDayHour={14}  />
        <Appointments />
      </Scheduler>
    </Paper>
  );
};

export default SchedulerComponent;
