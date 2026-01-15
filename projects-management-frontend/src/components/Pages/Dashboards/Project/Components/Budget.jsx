import "./budget.css";
import PaymentsIcon from "@mui/icons-material/Payments";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TollIcon from "@mui/icons-material/Toll";
import ApiIcon from "@mui/icons-material/Api";
import GrainIcon from "@mui/icons-material/Grain";
export function Budget() {
  return (
    <div className="projectDashWrapper">
      <h3>Budget</h3>
      <div className="budgetCard">
        <div>
          <span>Budget Spent</span>
          <h4>$40000</h4>
        </div>
        <PaymentsIcon style={{ height: "30px", width: "30px", color: "#6779a8" }} />
      </div>
      <div className="budgetPhases">
        <div className="budgetPhases-items">
          <div className="iconCont" style={{ background: "#1F6E8C" }}>
            <TollIcon />
          </div>

          <aside>
            <h6>Design</h6>
            <span>$ 50000</span>
          </aside>
          <KeyboardArrowRightIcon style={{ color: "rgb(179, 179, 179)" }} />
        </div>
        <div className="budgetPhases-items">
          <div className="iconCont" style={{ background: "#ea7f8c" }}>
            <ApiIcon />
          </div>

          <aside>
            <h6>Developement</h6>
            <span>$ 50000</span>
          </aside>
          <KeyboardArrowRightIcon style={{ color: "rgb(179, 179, 179)" }} />
        </div>
        <div className="budgetPhases-items">
          <div className="iconCont" style={{ background: "#8ece8d" }}>
            <GrainIcon />
          </div>

          <aside>
            <h6>Others</h6>
            <span>$ 50000</span>
          </aside>
          <KeyboardArrowRightIcon style={{ color: "rgb(179, 179, 179)" }} />
        </div>
      </div>
    </div>
  );
}
