import { Typography, Box } from "@mui/material";

const Header = ({ title, subtitle }) => {
  return (
    <Box mb="30px">
      <Typography
        variant="h4"
        color="#000"
        fontWeight="bold"
        sx={{ m: "40px 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h6" color="#2E8A99">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
