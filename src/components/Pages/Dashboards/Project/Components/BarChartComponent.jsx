import MyResponsiveBar from "./MyResponsiveBar";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import "./barChart.css";
export function BarChartComponent(props) {
  const data = [
    {
      country: "Sun",
      "hot dog": props.data.tasksCreatedPerDayLastWeek.Sunday,
      "hot dogColor": "hsl(0, 70%, 50%)",
    },
    {
      country: "Mon",
      // "hot dog": props.data.tasksCreatedPerDayLastWeek.Monday,
      "hot dog": 4,

      "hot dogColor": "hsl(226, 70%, 50%)",
    },
    {
      country: "Tue",
      "hot dog": props.data.tasksCreatedPerDayLastWeek.Tuesday,
      "hot dogColor": "hsl(39, 70%, 50%)",
    },
    {
      country: "Wen",
      "hot dog": props.data.tasksCreatedPerDayLastWeek.Wednesday,
      "hot dogColor": "hsl(26, 70%, 50%)",
    },
    {
      country: "Thu",
      "hot dog": props.data.tasksCreatedPerDayLastWeek.Thursday,
      "hot dogColor": "hsl(134, 70%, 50%)",
    },
    {
      country: "Fri",
      "hot dog": props.data.tasksCreatedPerDayLastWeek.Friday,
      "hot dogColor": "hsl(48, 70%, 50%)",
    },
    {
      country: "Sat",
      "hot dog": props.data.tasksCreatedPerDayLastWeek.Saturday,
      "hot dogColor": "hsl(25, 70%, 50%)",
    },
  ];

  return (
    <div className="barChartCont">
      <h6>Tasks Created Last Week</h6>
      <aside>
        <h4>
          {props.data.tasksCreatedPerDayLastWeek.Saturday +
            props.data.tasksCreatedPerDayLastWeek.Friday +
            props.data.tasksCreatedPerDayLastWeek.Thursday +
            props.data.tasksCreatedPerDayLastWeek.Wednesday +
            props.data.tasksCreatedPerDayLastWeek.Tuesday +
            props.data.tasksCreatedPerDayLastWeek.Monday +
            props.data.tasksCreatedPerDayLastWeek.Sunday}
        </h4>

        {props.icon === "down" ? (
          <SouthWestIcon
            className="arrowIndicator"
            style={{ background: "#f9bbbb", color: "#eb3a3a" }}
          />
        ) : (
          <NorthEastIcon
            className="arrowIndicator"
            style={{ background: "#cdeace", color: "#7fc083" }}
          />
        )}

        <span style={{ color: props.icon === "down" ? "#eb3a3a" : "#7fc083" }}>
          + {props.percentage}%
        </span>
      </aside>

      <MyResponsiveBar data={data} />
    </div>
  );
}
