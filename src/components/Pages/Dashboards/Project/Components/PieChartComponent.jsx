import MyResponsivePie from "./MyResponsivePie";
import "./pieChart.css";
export function PieChartComponent(props) {
  console.log(props);
  const data = [
    {
      id: "inProgress",
      label: "inProgress",
      value: props?.data.inProgress,
      color: "hsl(153, 70%, 50%)",
    },
    {
      id: "pending",
      label: "Pending",
      value: props?.data.inToDo,
      color: "hsl(176, 70%, 50%)",
    },

    {
      id: "completed",
      label: "completed",
      value: props?.data.inDone,
      color: "hsl(165, 70%, 50%)",
    },
  ];

  return (
    <div className="pieChartCont">
      <h4>Tasks</h4>
      <MyResponsivePie data={data} />
    </div>
  );
}
