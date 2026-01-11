import LinearWithValueLabel from "./LinearWithValueLabel";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import PropTypes from "prop-types";
import "./ToDoItem.css";
export function ToDoItem(props) {
  return (
    <div className="todo-wrapper">
      <div className="small-icon-container">
        <FolderOutlinedIcon className="folder-icon"></FolderOutlinedIcon>
      </div>
      <span>{props.project}</span>
      <div className="small-icon-container">{props.time}</div>
      <LinearWithValueLabel
        value={props.progress ? props.progress : 0}
      ></LinearWithValueLabel>
    </div>
  );
}
ToDoItem.propTypes = {
  project: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  progress: PropTypes.number,
};
