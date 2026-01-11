import MyResponsiveBar from "./MyResponsiveBar";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import "./barChart.css";
export function BarChartComponent2(props) {
  const data = [
    {
      country: "created",
      "hot dog": props.data.createdLastWeek,
      "hot dogColor": "hsl(0, 70%, 50%)",
    },
    {
      country: "finished",
      "hot dog": props.data.doneLastWeek,

      "hot dogColor": "hsl(226, 70%, 50%)",
    },
    {
      country: "updated",
      "hot dog": props.data.updatedLastWeek,
      "hot dogColor": "hsl(39, 70%, 50%)",
    },
  ];

  return (
    <div className="barChartCont">
      <h6>{props.text}</h6>
      <aside>
        <h4>{props.hours}</h4>

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
