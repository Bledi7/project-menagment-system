import { Typography, Box, useMediaQuery } from "@mui/material";

const Header = ({ title, subtitle, variant = "h4" }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box mb={isSmallScreen ? "20px" : "30px"}>
      <Typography
        variant={isSmallScreen ? "h5" : variant}
        color="#000"
        fontWeight="bold"
        sx={{ m: isSmallScreen ? "20px 0 5px 0" : "40px 0 5px 0" }}
      >
        {title}
      </Typography>
      {!isSmallScreen && (
        <Typography variant="h6" color="#2E8A99">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default Header;
