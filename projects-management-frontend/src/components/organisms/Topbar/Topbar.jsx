import { useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../../styles/theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import vali from "../../Atoms/images/vali.jpg";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { clearUser } from "../../../redux/userSlice";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isOpen, setIsOpen] = useState(null); // Used for Menu state
  const userInfo = useSelector((state) => state.user);
  const { firstName } = userInfo;
  console.log("userinfo", userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector(state => state.user);
  const imageUrl = `http://localhost:4000/api/getProfilePicture/${userId._id}`;

  const openMenu = (event) => {
    setIsOpen(event.currentTarget);
  };

  const closeMenu = () => {
    setIsOpen(null);
  };

  const handleLogout = () => {
    navigate(`/`);
    dispatch(clearUser());

    persistor.purge();
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        flexWrap="wrap"
      >
        {/* Icon Buttons */}
        <Box
          display="flex"
          justifyContent={isSmallScreen ? "center" : "flex-end"}
          width={isSmallScreen ? "100%" : "100%"}
        >
          <Box
            backgroundColor="#fefdfd"
            padding={isSmallScreen ? "0px" : "0 40px"}
            boxShadow="1px 1px #dadada"
            borderRadius="20px"
            border="1px solid #ecebeb"
            display="flex"
            alignItems="center"
            sx={{
              "&  .css-i4bv87-MuiSvgIcon-root": {
                width: isSmallScreen ? "15px" : "25px",
                height: isSmallScreen ? "15px" : "25px",
              },
            }}
          >
            <IconButton
              onClick={colorMode.toggleColorMode}
              style={{
                color: "#000",
              }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>
            <IconButton style={{ color: "#000" }}>
              <NotificationsOutlinedIcon />
            </IconButton>
            <IconButton style={{ color: "#000" }}>
              <SettingsOutlinedIcon />
            </IconButton>
            <IconButton onClick={openMenu}>
            <Avatar src={imageUrl} alt="avatar" sx={{ width: 30, height: 30, marginTop: "5%" }} />
            </IconButton>
          </Box>
          <Menu anchorEl={isOpen} open={Boolean(isOpen)} onClose={closeMenu}>
            <MenuItem>
              {userInfo ? (
                <Typography variant="body1">Hi there {firstName} !</Typography>
              ) : (
                <Typography variant="body1">You need to sign in</Typography>
              )}
            </MenuItem>
            {userInfo && (
              <MenuItem onClick={handleLogout}>
                <Typography variant="body1">Logout</Typography>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Box>
    </div>
  );
};

export default Topbar;

/* <Box
        display="flex"
        backgroundColor="#fff"
        boxShadow="1px 1px #e9e8e8"
        borderRadius="20px"
        border="1px solid #ecebeb"
      >
        <InputBase
          sx={{
            ml: 3,
            flex: 1,
            color: "#000",
            fontSize: "13px",
            pr: 5,
            backgroundColor: "#fff",
          }}
          placeholder="Search here..."
        />
        <IconButton type="button" sx={{ p: 1, color: "#5a5a5a" }}>
          <SearchIcon />
        </IconButton>
      </Box> */
