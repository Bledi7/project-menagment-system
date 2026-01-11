import "./main.css";
import person from "../../../Atoms/images/vali.jpg";

const DeveloperHeader = () => {
  return (
    <>
      <div className="nav">
        <h3>Projects</h3>
        <div className="input">
          <i className="fa fa-search"></i>
          <input type="text" name="search" id="" placeholder="Search..." />
        </div>
        <div className="Icon">
          <i className="fa fa-message"></i>
          <i className="fa fa-bell"></i>
          <i className="fa fa-gear"></i>
        </div>
        <div className="person-user">
          <img src={person} alt="" />
          <div className="user">
            <h3>Developer</h3>
            <p>developer@example.com</p>
          </div>
        </div>
      </div>
      <div className="menu-user">
        <button type="submit">+New</button>

        <div className="menu-bar">
          <div className="first-links">
            <ul>
              <li>
                {" "}
                <a className="active" href="">
                  All
                </a>
              </li>
              <li>
                {" "}
                <a href="/Inactive">Inactive</a>
              </li>
              <li>
                {" "}
                <a href="/Active">Active</a>
              </li>
              <li>
                {" "}
                <a href="/OnHold">On hold</a>
              </li>
              <li>
                {" "}
                <a href="/Completed">Completed</a>
              </li>
            </ul>
          </div>
          <div className="menu-end">
            <ul>
              <li>
                {" "}
                <a href="/Default">Default</a>
              </li>
              <li>
                {" "}
                <i className="fa fa-list"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeveloperHeader;
