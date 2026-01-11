import { Grid } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PropTypes from "prop-types";
import "./devPageCardItem.css";

export function DevPageCardItem({ icon: Icon, text, numbertext }) {
  return (
    //
    <Grid container className="main-grid">
      <Grid item xs={12}>
        <div className="main-grid-item">
          <div>{text}</div>
        </div>
      </Grid>
      <Grid item xs={12} className="main-grid-item">
        <div className="card-stats">{numbertext}</div>{" "}
        <div className="icon-container">
          <Icon className="icon-element" />
        </div>
      </Grid>
    </Grid>
  );
}

DevPageCardItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  numbertext: PropTypes.string.isRequired,
};

export function TimeTracker() {
  return (
    <div className="time-tracker-container">
      <div className="main-grid-header">
        <div>Start Time Tracker</div>
      </div>
      <div className="playicon-container">
        <PlayArrowRoundedIcon
          img={
            "https://images.pexels.com/photos/12810384/pexels-photo-12810384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          }
          className="icon-element"
        />
      </div>
    </div>
  );
}
export function TimeDisplayer() {
  return (
    <div className="time-container">
      <div>
        <h1>Today</h1>
        <span>mon. 22 2021|10:00 am</span>
      </div>
    </div>
  );
}
