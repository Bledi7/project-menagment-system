import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";
import "./dataGrid.css";
export default function FixedSizeGrid() {
  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 2,
    maxColumns: 3,
  });

  const columns = [
    { field: "name", headerName: "Name", width: 120 },
    { field: "tasks", headerName: "Tasks", width: 120 },
    { field: "hours", headerName: "Hours", width: 140 },
  ];

  const rows = [
    { id: 1, name: "John Doe", tasks: 30, hours: "12h 30m" },
    { id: 2, name: "Jane Smith", tasks: 28, hours: "3h 12m" },
    // Add more data rows as needed
  ];

  return (
    <div className="gridCont">
      <div style={{ width: "100%" }}>
        <h4>Team</h4>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </div>
  );
}
