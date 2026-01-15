import "./DevPageImgItem.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
export function DevPageImgItem() {
  return (
    <div className="img-card-container wrapper">
      <div className="main-grid-item">
        <span>Projects</span>{" "}
      </div>
      <div className="viewAll">
        <Avatar
          style={{ width: "36px", height: "36px" }}
          alt="Remy Sharp"
          src="https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        />
        <span>Remy Sharp</span>
        <Button
          variant="contained"
          size="small"
          style={{ backgroundColor: "#2E8A99", color: "white" }}
        >
          View All
        </Button>
      </div>

      <Grid
        container
        className="img-grid"
        spacing={{ xs: 1, md: 3 }}
        columns={{ xs: 6, sm: 12, md: 12 }}
      >
        <Grid item xs={2} sm={4} md={4}>
          <img
            src="https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            srcSet=""
            className="projectImg"
          />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <img
            src="https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            srcSet=""
            className="projectImg"
          />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <img
            src="https://images.pexels.com/photos/17334829/pexels-photo-17334829/free-photo-of-man-people-woman-street.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            srcSet=""
            className="projectImg"
          />
        </Grid>
        <Grid item xs={2} sm={4} md={4} className="test1">
          <img
            src="https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            srcSet=""
            className="projectImg"
          />
        </Grid>
        <Grid item xs={2} sm={4} md={4} className="test1">
          <img
            src="https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            srcSet=""
            className="projectImg"
          />
        </Grid>
        <Grid item xs={2} sm={4} md={4} className="test1">
          <img
            src="https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            srcSet=""
            className="projectImg"
          />
        </Grid>
      </Grid>
    </div>
  );
}
