import { Box } from "@mui/material";
import Dashboard from "./scenes/dashboard";

function ScrumMaster() {
  return (
    <Box flexGrow={1}>
      <div className="app">
        <main className="content">
          <Dashboard />
        </main>
      </div>
    </Box>
  );
}

export default ScrumMaster;
