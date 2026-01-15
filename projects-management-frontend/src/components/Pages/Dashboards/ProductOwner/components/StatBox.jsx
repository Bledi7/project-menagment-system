import { Box, Typography } from "@mui/material";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#2E8A99" }}>
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography
          variant="h5"
          py="10px"
          sx={{ color: "#000", fontSize: "14px", fontWeight: "600" }}
        >
          {subtitle}
        </Typography>
        <Typography variant="h6" sx={{ color: "#2E8A99" }}>
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
