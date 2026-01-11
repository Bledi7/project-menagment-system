import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));

  const titleFontSize = isXs ? "15px" : isSm ? "17px" : "20px";

  const subtitleFontSize = isXs ? "10px" : isSm ? "12px" : "14px";

  const increaseFontSize = isXs ? "10px" : isSm ? "12px" : "14px";

  const progressCircleSize = isXs ? "60px" : isSm ? "50px" : "60px";

  return (
    <Box
      p="20px"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box alignItems="center">
          {icon}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: "#2E8A99", padding: "5px", fontSize: titleFontSize }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          mt="8px"
          sx={{ width: progressCircleSize, height: progressCircleSize }}
        >
          <ProgressCircle progress={progress} />
        </Box>
      </Box>
      <Box display="flex" alignItems="center" mt="10px">
        <Typography
          variant="h5"
          sx={{
            color: "#000",
            fontSize: subtitleFontSize,
            fontWeight: "600",
          }}
        >
          {subtitle}
        </Typography>
        <Box
          sx={{
            fontSize: increaseFontSize,
            fontWeight: "600",
            color: "#7FC083",
            backgroundColor: "transparent",
            boxShadow: "2px 1px rgba(0, 0, 0, 0.25)",
            borderRadius: "20px",
            padding: "5px",
            minWidth: "60px",
            textAlign: "center",
            marginLeft: "auto",
          }}
        >
          {increase}
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;
