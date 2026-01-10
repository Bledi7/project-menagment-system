import { Box, Button, Typography, Grid, Card } from "@mui/material";
import { Link } from "react-router-dom";
import "./home.css";

const WelcomePage = () => {
  return (
    <Box className="background-svg">
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        style={{ fontFamily: "Poppins" }}
      >
        <Grid item xs={12} sm={6} md={6}>
          <Box className="welcome-text">
            <Typography
              variant="h4"
              gutterBottom
              style={{ fontFamily: "Poppins" }}
            >
              Welcome to
            </Typography>
            <Typography
              variant="h3"
              gutterBottom
              style={{ fontFamily: "Poppins", marginBottom: "3rem" }}
            >
              <span className="starlabs-text">Starlabs</span> PMS
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ fontFamily: "Poppins" }}
            >
              Starlabs&#39; advanced projects management system
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card
            className="welcome-form"
            sx={{
              padding: "2rem",
              display: "grid",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <Typography
              variant="h5"
              textAlign="center"
              style={{ fontFamily: "Poppins", marginBottom: "2rem" }}
            >
              PLEASE LOGIN OR REGISTER
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
              style={{
                padding: "10px",
                marginBottom: "20px",
                fontFamily: "Poppins",
                width: "100%",
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="error"
              component={Link}
              to="/register"
              style={{
                padding: "10px",
                fontFamily: "Poppins",
                width: "100%",
              }}
            >
              Register
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WelcomePage;
