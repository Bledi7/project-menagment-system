import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonIcon from "@mui/icons-material/Person";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import Header from "../../components/Header";
import MemoizedLineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AssignmentIcon from "@mui/icons-material/Assignment";

const PAGE_SIZE = 4;

const Dashboard = () => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const currentTransactions = mockTransactions.slice(startIndex, endIndex);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Hello StarLabs" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: "#2E8A99",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "bold",
              padding: "10px 20px",
              boxShadow: "0px 0px 12px 5px #e9e8e8",
              borderRadius: "3px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "5px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor="#fff"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0px 0px 12px 5px #e9e8e8"
          borderRadius="3px"
        >
          <StatBox
            title="25"
            subtitle="Projects Done"
            progress="0.75"
            increase="+14%"
            icon={
              <AccountTreeIcon sx={{ color: "#2E8A99", fontSize: "30px" }} />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor="#fff"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0px 0px 12px 5px #e9e8e8"
          borderRadius="3px"
        >
          <StatBox
            title="15"
            subtitle="New Projects"
            progress="0.50"
            increase="+4%"
            icon={
              <AccountTreeIcon sx={{ color: "#2E8A99", fontSize: "30px" }} />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor="#fff"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0px 0px 12px 5px #e9e8e8"
          borderRadius="3px"
        >
          <StatBox
            title="220"
            subtitle="Total Members"
            progress="0.30"
            increase="+5%"
            icon={<PersonIcon sx={{ color: "#2E8A99", fontSize: "30px" }} />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor="#fff"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0px 0px 12px 5px #e9e8e8"
          borderRadius="3px"
        >
          <StatBox
            title="1,325,134"
            subtitle="Total Revenue"
            progress="0.80"
            increase="+43%"
            icon={
              <RequestQuoteIcon sx={{ color: "#2E8A99", fontSize: "30px" }} />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor="#fff"
          boxShadow="0px 0px 12px 5px #e9e8e8"
          borderRadius="3px"
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight="600" color="#000">
                Projects Statistics
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "28px", color: "#1F6E8C" }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <MemoizedLineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor="#fff"
          boxShadow="0px 0px 12px 5px #e9e8e8"
          borderRadius="3px"
          overflow="auto"
          p="10px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`2px solid #000`}
            colors="#000"
            p="15px"
          >
            <Typography variant="h5" fontWeight="600" color="#000">
              Project Details
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`1px solid ${"#000"}`}
              p="12px"
            >
              <Box>
                <Typography
                  color="#2E8A99"
                  fontSize="15px"
                  fontWeight="600"
                  py="5px"
                >
                  {transaction.txId}
                </Typography>
                <Typography color="#000" fontSize="12px" p="">
                  {transaction.user}
                </Typography>
                <Typography color="#000" fontSize="12px">
                  {transaction.date}
                </Typography>
              </Box>
              <Box
                backgroundColor="#2E8A99"
                color="#fff"
                p="5px 10px"
                borderRadius="3px"
              >
                more
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor="#fff"
          boxShadow="0px 0px 12px 5px #e9e8e8"
          borderRadius="3px"
          p="30px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb="20px"
          >
            <Typography variant="h5" fontWeight="600" color="#000">
              Milestone Progress
            </Typography>
            <Box>
              <IconButton
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                sx={{
                  color: currentPage === 1 ? "#000" : "#000",
                  p: "4px",
                  borderRadius: "4px",
                  mr: "10px",
                  visibility: currentPage === 1 ? "hidden" : "visible",
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: "16px" }} />
              </IconButton>
              <IconButton
                onClick={handleNextPage}
                disabled={endIndex >= mockTransactions.length}
                sx={{
                  color: endIndex >= mockTransactions.length ? "#000" : "#000",
                  p: "4px",
                  borderRadius: "4px",
                  visibility:
                    endIndex >= mockTransactions.length ? "hidden" : "visible",
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: "16px" }} />
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
            <Typography fontSize="15px" color="#666666" fontWeight="bold">
              No.
            </Typography>
            <Typography fontSize="15px" color="#666666" fontWeight="bold">
              Project Name
            </Typography>
            <Typography fontSize="15px" color="#666666" fontWeight="bold">
              Team
            </Typography>
            <Typography fontSize="15px" color="#666666" fontWeight="bold">
              Deadline
            </Typography>
            <Typography variant="subtitle1" color="#666666" fontWeight="bold">
              Status
            </Typography>
          </Box>
          {currentTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="grid"
              gridTemplateColumns="1fr 4fr 4fr 3.3fr 1.5fr"
              alignItems="center"
              py="9px"
            >
              <Typography fontSize="13px" color="#666666" fontWeight="600">
                {startIndex + i + 1}
              </Typography>
              <Box display="flex" alignItems="center">
                <AssignmentIcon
                  sx={{
                    mr: "7px",
                    fontSize: "16px",
                    color: "#1F6E8C",
                  }}
                />
                <Typography fontSize="13px" color="#1F6E8C" fontWeight="600">
                  Project {startIndex + i + 1}
                </Typography>
              </Box>
              <Typography fontSize="13px" color="#000" fontWeight="600">
                Team {startIndex + i + 1}
              </Typography>
              <Typography fontSize="13px" color="#992020" fontWeight="600">
                Fri 02, 15:30
              </Typography>
              <Box>
                <Box
                  backgroundColor={
                    i === 0
                      ? "#808080"
                      : i === 1
                      ? "#008000"
                      : i === 2
                      ? "#ffce0b"
                      : "#cd0505"
                  }
                  color="#fff"
                  p="3px 5px"
                  borderRadius="3px"
                  fontSize="11px"
                  textAlign="center"
                  flex="1"
                >
                  {i === 0
                    ? "On hold"
                    : i === 1
                    ? "Active"
                    : i === 2
                    ? "Pending"
                    : "Inactive"}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor="#fff"
          boxShadow="0px 0px 12px 5px #e9e8e8"
          borderRadius="3px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            color="#000"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Projects Categories
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        {/* <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor="#fff"
          boxShadow="0px 0px 12px 5px #e9e8e8"
          borderRadius="3px"
          p="30px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb="20px"
          >
            <Typography
              color={colors.primary[200]}
              variant="h3"
              fontWeight="600"
            >
              Milestone Progress
            </Typography>
            <Box>
              <IconButton
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                sx={{
                  color:
                    currentPage === 1
                      ? colors.primary[100]
                      : colors.primary[200],
                  p: "4px",
                  borderRadius: "4px",
                  mr: "10px",
                  visibility: currentPage === 1 ? "hidden" : "visible",
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: "16px" }} />
              </IconButton>
              <IconButton
                onClick={handleNextPage}
                disabled={endIndex >= mockTransactions.length}
                sx={{
                  color:
                    endIndex >= mockTransactions.length
                      ? colors.primary[100]
                      : colors.primary[200],
                  p: "4px",
                  borderRadius: "4px",
                  visibility:
                    endIndex >= mockTransactions.length ? "hidden" : "visible",
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: "16px" }} />
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
              variant="subtitle1"
              color={colors.grey[500]}
              fontWeight="bold"
            >
              No.
            </Typography>
            <Typography
              variant="subtitle1"
              color={colors.grey[500]}
              fontWeight="bold"
            >
              Project Name
            </Typography>
            <Typography
              variant="subtitle1"
              color={colors.grey[500]}
              fontWeight="bold"
            >
              Team
            </Typography>
            <Typography
              variant="subtitle1"
              color={colors.grey[500]}
              fontWeight="bold"
            >
              Deadline
            </Typography>
            <Typography
              variant="subtitle1"
              color={colors.grey[500]}
              fontWeight="bold"
            >
              Status
            </Typography>
          </Box>
          {currentTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="grid"
              gridTemplateColumns="1fr 4fr 4fr 3.3fr 1.5fr"
              alignItems="center"
              py="10px"
            >
              <Typography
                variant="subtitle1"
                color={colors.grey[100]}
                fontWeight="600"
              >
                {startIndex + i + 1}
              </Typography>
              <Box display="flex" alignItems="center">
                <AssignmentIcon
                  sx={{
                    mr: "7px",
                    fontSize: "16px",
                    color: colors.greenAccent[400],
                  }}
                />
                <Typography
                  variant="subtitle1"
                  color={colors.greenAccent[400]}
                  fontWeight="600"
                >
                  Project {startIndex + i + 1}
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                color={colors.blueAccent[200]}
                fontWeight="600"
              >
                Team {startIndex + i + 1}
              </Typography>
              <Typography
                variant="subtitle1"
                color={colors.redAccent[400]}
                fontWeight="600"
              >
                Fri 02, 15:30
              </Typography>
              <Box>
                <Box
                  backgroundColor={
                    i === 0
                      ? "#808080"
                      : i === 1
                      ? "#008000"
                      : i === 2
                      ? "#ffce0b"
                      : "#cd0505"
                  }
                  color="#fff"
                  p="3px 5px"
                  borderRadius="3px"
                  fontSize="11px"
                  textAlign="center"
                  flex="1"
                >
                  {i === 0
                    ? "On hold"
                    : i === 1
                    ? "Active"
                    : i === 2
                    ? "Pending"
                    : "Canceled"}
                </Box>
              </Box>
            </Box>
          ))}
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
