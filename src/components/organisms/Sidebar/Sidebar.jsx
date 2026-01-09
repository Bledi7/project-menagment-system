import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../styles/theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import Logo from "../../Atoms/images/logo.svg";

import NotesIcon from '@mui/icons-material/Notes';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useDispatch } from "react-redux";
import { clearUser } from "../../../redux/userSlice";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.primary[200] }}
      onClick={() => {
        setSelected(title), logicFunction();
      }}
      icon={icon}
    >
      <Link to={to} style={{ textDecoration: "none" }}>
        <Typography>{title}</Typography>
      </Link>
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [width, setWidth] = useState("");

  function getSize() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", getSize);
    if (width < 767) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
    return () => {
      window.removeEventListener("resize", getSize);
    };
  }, [window.innerWidth]);

  const handleLogoutClick = () => {
    const dispatch = useDispatch();
    dispatch(clearUser());
    const navigate = useNavigate();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        "& .pro-menu a": {
          textDecoration: "none",
          color: "#080b12",
        },
        "& .pro-sidebar": {
          boxShadow: "0px 0px 12px 5px #e9e8e8",
        },
        "& .pro-sidebar-inner": {
          background: "#f9f9f9",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "3px 10px 0 25px !important",
          lineHeight: 2,
        },
        "& svg": {
          fontSize: "23px",
        },
        "& .pro-inner-item:hover": {
          color: "#1F6E8C !important",
        },
        "& .css-14zrr9g-MuiTypography-root": {
          fontSize: "14px",
        },
        "& .pro-menu-item.active": {
          color: "#1F6E8C!important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "5px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box ml="180px" color="#000">
                <IconButton
                  style={{ color: colors.primary[200] }}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={2}
              >
                <img alt="logo" width="50px" height="50px" src={Logo} />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h5"
                  color={colors.primary[200]}
                  fontWeight="bold"
                  sx={{ m: "0 0 50px 0" }}
                >
                  Star<span>Labs</span>
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/scrumMaster"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              fontSize="14px"
              fontWeight="600"
              color="#000"
              sx={{ m: "15px 4px 10px 23px" }}
            >
              Data
            </Typography>
            <Item
              title="Manage Team"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Manage Users"
              to="/admin"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              fontSize="14px"
              fontWeight="600"
              color="#000"
              sx={{ m: "15px 4px 10px 23px" }}
            >
              Pages
            </Typography>
            <Item
              title="Projects"
              to="/projects"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Reports"
              to="/reports"
              icon={<ReportGmailerrorredIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="My Reports"
              to="/myReports"
              icon={<NotesIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Profile"
              to="/userProfile"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                    <Item
              title="Update Profile"
              to="/updateUserProfile"
              icon={<BorderColorIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              fontSize="14px"
              fontWeight="600"
              color="#000"
              sx={{ m: "15px 4px 10px 23px" }}
            >
              Others
            </Typography>
            <Item
              title="Logout"
              to="/login"
              icon={<LogoutIcon />}
              selected={selected}
              setSelected={setSelected}
              // logicFunction={handleLogoutClick}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
