import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const Panel = () => {
  return (
    <div style={{ margin: "20px" }}>
      <Typography variant="h3" gutterBottom>
        Admin Page
      </Typography>
      <Grid container spacing={2}>
        {/* First Card - Users */}
        <Grid item xs={12} sm={6} md={4}>
          <Card style={{ padding: "20px" }}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <PersonIcon style={{ fontSize: "90px" }} />
                </Box>
                <Box textAlign="right">
                  <Typography variant="h3" component="div" fontWeight="bold">
                    250 {/* Replace this with the dynamic value later */}
                  </Typography>
                  <Typography color="textSecondary">Users</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Second Card - Teams */}
        <Grid item xs={12} sm={6} md={4}>
          <Card style={{ padding: "20px" }}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <PersonIcon style={{ fontSize: "90px" }} />
                </Box>
                <Box textAlign="right">
                  <Typography variant="h3" component="div" fontWeight="bold">
                    50 {/* Replace this with the dynamic value later */}
                  </Typography>
                  <Typography color="textSecondary">Teams</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Third Card - Active Users */}
        <Grid item xs={12} sm={6} md={4}>
          <Card style={{ padding: "20px" }}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <PersonIcon style={{ fontSize: "90px" }} />
                </Box>
                <Box textAlign="right">
                  <Typography variant="h3" component="div" fontWeight="bold">
                    100 {/* Replace this with the dynamic value later */}
                  </Typography>
                  <Typography color="textSecondary">Active Users</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Additional Features */}
      {/* TODO: Implement the additional features here */}
    </div>
  );
};

export default Panel;
