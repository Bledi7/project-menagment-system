import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const AdminHeader = ({ handleCreateUser }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      p={2}
      display="flex"
      flexDirection={isSmallScreen ? "column" : "row"}
      justifyContent={isSmallScreen ? "center" : "space-between"}
      alignItems={isSmallScreen ? "center" : "center"}
      color="#000"
      marginBottom="40px"
    >
      <Typography
        variant={isSmallScreen ? "h5" : "h4"}
        color="#000"
        fontWeight="bold"
        textAlign={isSmallScreen ? "center" : "left"}
        sx={{ m: isSmallScreen ? "10px 0 5px 0" : "20px 0 5px 0" }}
      >
        Manage Users
      </Typography>
      <Button
        variant="contained"
        color="success"
        onClick={handleCreateUser}
        sx={{
          backgroundColor: "#2E8A99",
          color: "#fff",
          fontSize: isSmallScreen ? "10px" : "13px",
          fontWeight: "bold",
          padding: "10px 20px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
          borderRadius: "20px",
          minWidth: "fit-content",
          marginTop: isSmallScreen ? "10px" : "0",
        }}
      >
        + New User
      </Button>
    </Box>
  );
};

export default AdminHeader;
