import React, { useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Box,
  Button,
  IconButton,
  Typography,
  Grid,
  Card,
} from "@mui/material";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonIcon from "@mui/icons-material/Person";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import MemoizedLineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const PAGE_SIZE = 4;

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  const navigate = useNavigate();
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentTransactions = mockTransactions.slice(startIndex, endIndex);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isSmallScreenRow1 = useMediaQuery(theme.breakpoints.between("xs", 600));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down(420));
  const gridXs = isExtraSmallScreen ? 12 : isSmallScreenRow1 ? 6 : 4;
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const user = useSelector((state) => state.user);

  const handleOptionClick = (team) => {
    console.log("Selected option:", team);
    navigate("/teammembers", { state: { teamData: team } });
  };
  useEffect(() => {
    const fetchTeamsByProject = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/teams-by-project"
        );
        console.log(response.data);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching teams by project:", error);
      }
    };
    fetchTeamsByProject();
  }, []);

  useEffect(() => {
    const fetchTeamsByLead = async () => {
      const leadId = user._id;
      //use leadId instead of static id
      const apiUrl = `http://localhost:4000/api/teams/with-lead?leadId=64df678749a743dedf39fcaf`;
      try {
        const response = await axios.get(apiUrl);
        console.log(response.data);
        setTeams(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchTeamsByLead();
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box
        display="flex"
        flexDirection={isSmallScreen ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isSmallScreen ? "center" : "center"}
        marginBottom="40px"
      >
        <Box
          textAlign={isSmallScreen ? "center" : "left"}
          marginBottom={isSmallScreen ? "10px" : 0}
          padding={isSmallScreen ? "0 10px" : 0}
        >
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            color="#000"
            fontWeight="bold"
            sx={{ m: "20px 0 5px 0" }}
          >
            Hello StarLabs
          </Typography>
          <Typography
            fontSize={isSmallScreen ? "15px" : "20px"}
            color="#2E8A99"
          >
            Welcome to your dashboard
          </Typography>
        </Box>
        <Box>
          <Button
            sx={{
              backgroundColor: "#2E8A99",
              color: "#fff",
              fontSize: isSmallScreen ? "10px" : "13px",
              fontWeight: "bold",
              padding: "10px 20px",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "5px" }} />
            {isSmallScreen ? "Download Reports" : "Download Reports"}
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Grid container spacing={2}>
        {/* ROW 1 */}
        <Grid item xs={gridXs} sm={6} md={6} lg={3}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
            }}
          >
            <StatBox
              noWrap
              title="25"
              subtitle="Projects Done"
              progress="0.75"
              increase="+14%"
              icon={
                <AccountTreeIcon sx={{ color: "#2E8A99", fontSize: "40px" }} />
              }
            />
          </Card>
        </Grid>
        <Grid item xs={gridXs} sm={6} md={6} lg={3}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
            }}
          >
            <StatBox
              title="15"
              subtitle="New Projects"
              progress="0.50"
              increase="+4%"
              icon={
                <AccountTreeIcon sx={{ color: "#2E8A99", fontSize: "40px" }} />
              }
            />
          </Card>
        </Grid>

        <Grid item xs={gridXs} sm={6} md={6} lg={3}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
            }}
          >
            <StatBox
              title="220"
              subtitle="Total Members"
              progress="0.30"
              increase="+5%"
              icon={<PersonIcon sx={{ color: "#2E8A99", fontSize: "40px" }} />}
            />
          </Card>
        </Grid>
        <Grid item xs={gridXs} sm={6} md={6} lg={3}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
            }}
          >
            <StatBox
              title="1,325,134"
              subtitle="Total Revenue"
              progress="0.80"
              increase="+43%"
              icon={
                <RequestQuoteIcon sx={{ color: "#2E8A99", fontSize: "40px" }} />
              }
            />
          </Card>
        </Grid>

        {/* ROW 2 */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
              p: "30px",
            }}
          >
            <Box
              mt="25px"
              p="0px"
              display="flex "
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant={isSmallScreen ? "subtitle1" : "h5"}
                  fontWeight="600"
                  color="#000"
                >
                  Projects Statistics
                </Typography>
              </Box>
              <Box>
                <IconButton>
                  <DownloadOutlinedIcon
                    sx={{
                      fontSize: isSmallScreen ? "20px" : "28px",
                      color: "#1F6E8C",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box height="250px" m="-20px 0 0 0">
              <MemoizedLineChart isDashboard={true} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
              p: "30px",
              height: "360px",
              overflow: "auto",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`2px solid #000`}
              colors="#000"
              p="15px"
            >
              <Typography
                variant={isSmallScreen ? "subtitle1" : "h5"}
                fontWeight="600"
                color="#000"
              >
                My Teams
              </Typography>
            </Box>
            {teams.map((team, i) => (
              <Box
                key={i}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`1px solid ${"#000"}`}
                p="12px"
              >
                <Box>
                  <Typography
                    color="#2E8A99"
                    sx={{ fontSize: isSmallScreen ? "12px" : "15px" }}
                    fontWeight="600"
                    py="5px"
                  >
                    {team.title}
                  </Typography>
                  <Typography
                    color="#000"
                    sx={{ fontSize: isSmallScreen ? "10px" : "12px" }}
                  ></Typography>
                  <Typography
                    color="#000"
                    sx={{ fontSize: isSmallScreen ? "10px" : "12px" }}
                  >
                    {/* {transaction.date} */}
                  </Typography>
                </Box>
                <Box
                  style={{ cursor: "pointer" }}
                  backgroundColor="#2E8A99"
                  color="#fff"
                  p="5px 10px"
                  borderRadius="20px"
                  sx={{ fontSize: isSmallScreen ? "10px" : "15px" }}
                  onClick={() => handleOptionClick(team)}
                >
                  More
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>

        {/* ROW 3 */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
              p: "30px",
              height: "100%",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb="20px"
            >
              <Typography
                variant={isSmallScreen ? "subtitle1" : "h5"}
                fontWeight="600"
                color="#000"
              >
                Milestone Progress
              </Typography>
              <Box>
                <IconButton
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  sx={{
                    color: currentPage === 1 ? "#000" : "#000",
                    p: "4px",
                    borderRadius: "8px",
                    mr: "10px",
                    visibility: currentPage === 1 ? "hidden" : "visible",
                  }}
                >
                  <ArrowBackIosNewIcon
                    sx={{ fontSize: isSmallScreen ? "12px" : "16px" }}
                  />
                </IconButton>
                <IconButton
                  onClick={handleNextPage}
                  disabled={endIndex >= mockTransactions.length}
                  sx={{
                    color:
                      endIndex >= mockTransactions.length ? "#000" : "#000",
                    p: "4px",
                    borderRadius: "8px",
                    visibility:
                      endIndex >= mockTransactions.length
                        ? "hidden"
                        : "visible",
                  }}
                >
                  <ArrowForwardIosIcon
                    sx={{ fontSize: isSmallScreen ? "12px" : "16px" }}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box
              display="grid"
              gridTemplateColumns="1fr 4fr 4fr 3.5fr 1.3fr"
              alignItems="center"
              mt="10px"
              mb="15px"
              borderBottom="1px solid #e0e0e0"
              pb="5px"
            >
              <Typography
                fontSize={isSmallScreen ? "9px" : "15px"}
                color="#666666"
                fontWeight="bold"
              >
                No.
              </Typography>
              <Typography
                fontSize={isSmallScreen ? "9px" : "15px"}
                color="#666666"
                fontWeight="bold"
              >
                Project Name
              </Typography>
              <Typography
                fontSize={isSmallScreen ? "9px" : "15px"}
                color="#666666"
                fontWeight="bold"
              >
                Team
              </Typography>
              <Typography
                fontSize={isSmallScreen ? "9px" : "15px"}
                color="#666666"
                fontWeight="bold"
              >
                Deadline
              </Typography>
              <Typography
                variant="subtitle1"
                fontSize={isSmallScreen ? "9px" : "15px"}
                color="#666666"
                fontWeight="bold"
              >
                Status
              </Typography>
            </Box>
            {projects.map((project, i) => (
              <Box
                key={i}
                display="grid"
                gridTemplateColumns="1fr 4fr 4fr 3.3fr 1.5fr"
                alignItems="center"
                py="9px"
              >
                <Typography
                  fontSize={isSmallScreen ? "9px" : "13px"}
                  color="#666666"
                  fontWeight="600"
                >
                  {startIndex + i + 1}
                </Typography>
                <Box display="flex" alignItems="center">
                  <AssignmentIcon
                    sx={{
                      mr: "7px",
                      fontSize: isSmallScreen ? "9px" : "16px",
                      color: "#1F6E8C",
                    }}
                  />
                  <Typography
                    fontSize={isSmallScreen ? "9px" : "13px"}
                    color="#1F6E8C"
                    fontWeight="600"
                    //make line break
                    // style={{ whiteSpace: "pre!important" }}
                  >
                    {project.project.title}
                  </Typography>
                </Box>

                <Typography
                  fontSize={isSmallScreen ? "9px" : "13px"}
                  color="#000"
                  fontWeight="600"
                >
                  {project.teams.map((team, j) => (
                    <p key={j}>{team}</p>
                  ))}
                </Typography>

                <Typography
                  fontSize={isSmallScreen ? "9px" : "13px"}
                  color="#992020"
                  fontWeight="600"
                >
                  Fri 02, 15:30
                </Typography>
                <Box>
                  <Box
                    backgroundColor={
                      project.project.status === "On hold"
                        ? "#808080"
                        : project.project.status === "Active"
                        ? "#008000"
                        : project.project.status === "Pending"
                        ? "#ffce0b"
                        : "#cd0505"
                    }
                    color="#fff"
                    p="1px 3px"
                    borderRadius="4px"
                    fontSize={isSmallScreen ? "8px" : "11px"}
                    textAlign="center"
                    flex="1"
                    sx={{ whiteSpace: "nowrap", minWidth: "40px" }}
                  >
                    {project.project.status}
                  </Box>
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
              p: "30px",
              height: "100%",
            }}
          >
            <Typography
              variant={isSmallScreen ? "subtitle1" : "h5"}
              fontWeight="600"
              color="#000"
              sx={{ padding: "30px 0 0 0" }}
            >
              Projects Categories
            </Typography>
            <Box height="250px" mt="-20px">
              {/* <BarChart isDashboard={true} /> */}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
