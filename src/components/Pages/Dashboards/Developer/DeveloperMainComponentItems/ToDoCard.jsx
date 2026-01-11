import { ToDoItem } from "./ToDoItem";
import "../../../../Atoms/buttons/button.css";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
export function ToDoCard() {
  return (
    <div className="wrapper">
      <div>
        <span style={{ padding: "0px 10px" }}>To Do</span>{" "}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: ".95fr 1fr",
            padding: " 10px",
            gap: "5px",
            fontSize: "11.5px",
          }}
        >
          {" "}
          <span>To Dos</span> <span>Time</span>
        </div>
        <div style={{ display: "grid", gap: "1rem" }}>
          <ToDoItem
            time={"12:00:00"}
            project={"firstProject"}
            progress={40}
          ></ToDoItem>
          <ToDoItem
            time={"12:00:00"}
            project={"firstProject"}
            progress={40}
          ></ToDoItem>
          <ToDoItem
            time={"12:00:00"}
            project={"firstProject"}
            progress={40}
          ></ToDoItem>
          <ToDoItem
            time={"12:00:00"}
            project={"firstProject"}
            progress={40}
          ></ToDoItem>
        </div>
      </div>
      <Button variant="contained" size="small" id="viewMore-button">
        View More
        <AddRoundedIcon className="viewMoreIcon"></AddRoundedIcon>
      </Button>
    </div>
  );
}
