import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Modal,
  Box,
  Button,
  TextField,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import ProfileImg from "../../../../Atoms/images/starlabs.png";
import CreateReport from "../../Developer/DeveloperInnerPage/CreateReport";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ReactPaginate from "react-paginate";
import './reports.css';


const Reports = () => {
  const [reports, setReports] = useState([].slice(0, 50));
  const [selectedReportId, setSelectedReportId] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isCreateReportModalOpen, setIsCreateReportModalOpen] = useState(false);
  const theme = useTheme();
  const [sortByFavoritesAsc, setSortByFavoritesAsc] = useState(true);
  const [sortByCheckedAsc, setSortByCheckedsAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [favoriteIcon, setFavortieIcon] = useState(false);
  const [checked, setChecked] = useState(false);
  const reportsPerPage = 3;
  const pageVisited = reportsPerPage * pageNumber;
  const userId = useSelector(state => state.user);


  const [imageProfile, setImageProfile] = useState();
  const [imageName, setImage] = useState();

  // Function to add a new report to the projects list
  const handleReportAdded = (newReport, imageUrl, firstName) => {
    setReports((prevReports) => [...prevReports, newReport]);
    const updatedReports = [...reports, newReport];
    localStorage.setItem("reports", JSON.stringify(updatedReports));
    setImageProfile(imageUrl);
    console.log('this is firstName', firstName)
    setImage(firstName);
  };
  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    try {
      const result = await axios.get("http://localhost:4000/api/getReport");
      const formattedReports = result.data.map((report) => ({
        ...report
      }));

      console.log('formattedReports', formattedReports);
      // Remove deleted reports from the fetched data
      const updatedReports = formattedReports.filter(report => !report.isDeleted);
      console.log("Updated reports")
      setReports(updatedReports);
      console.log('userId._id', userId._id)
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleReportFavoriteToggle = async (reportId) => {
    try {
      await axios.put(`http://localhost:4000/api/updateReport/${reportId}`, {
        isFavorite: !reports.find(report => report._id === reportId).isFavorite
      });
      getReports();
    } catch (error) {
      console.log('error', error)
    }
  };

  const handleReportReadToggle = async (reportId) => {
    try {
      await axios.put(`http://localhost:4000/api/updateReport/${reportId}`, {
        isRead: !reports.find(report => report._id === reportId).isRead
      });
      getReports(); // Refresh the reports after updating
    } catch (error) {
      console.error(error);
    }
  };

  // Similar change for handleReportCheckedToggle

  const handelOpenDeleteModal = (reportId) => {
    setOpenDeleteModal(true);
    setSelectedReportId(reportId);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedReportId("");
  };


  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/deleteReport/${selectedReportId}`
      );
      // Refresh the projects list
      getReports();

      handleCloseDeleteModal();
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPageNumber(0); // Reset the page number when a new search term is entered
  };

  const handleOpenCreateReportModal = () => {
    setIsCreateReportModalOpen(true);
  };

  // Function to close the modal
  const handleCloseCreateReportModal = () => {
    setIsCreateReportModalOpen(false);
  };
  const compareDates = (report1, report2) => {
    const date1 = new Date(report1.date);
    const date2 = new Date(report2.date);
    return date2 - date1; // Compare in reverse order for newest first
  };

  // Function to sort by latest date
  const sortByNewestDate = () => {
    const sortedReports = [...reports].sort(compareDates);
    setReports(sortedReports);
  };

  // Function to sort by newest date
  const sortByLatestDate = () => {
    const sortedReports = [...reports].sort((report1, report2) =>
      compareDates(report2, report1)
    );
    setReports(sortedReports);
  };

  const sortByFavorites = () => {
    const sortedReports = [...reports].sort((report1, report2) => {
      const factor = sortByFavoritesAsc ? 1 : -1;

      if (report1.isFavorite && !report2.isFavorite) {
        return -1 * factor;
      }
      if (!report1.isFavorite && report2.isFavorite) {
        return 1 * factor;
      }
      return 0;
    });

    setReports(sortedReports);
    setSortByFavoritesAsc(!sortByFavoritesAsc); // Toggle the sorting order
  };

  const sortByChecked = () => {
    const sortedReports = [...reports].sort((report1, report2) => {
      const factor = sortByCheckedAsc ? 1 : -1;

      if (report1.isRead && !report2.isRead) {
        return -1 * factor;
      }
      if (!report1.isRead && report2.isRead) {
        return 1 * factor;
      }
      return 0;
    });

    setReports(sortedReports);
    setSortByCheckedsAsc(!sortByCheckedAsc); // Toggle the sorting order
  };
  const filteredReports = reports.filter(report => {
    if (report.userName) {
      return report.userName.startsWith(searchTerm);
    }
    return false;
  });

  const displayReports = filteredReports
    .slice(pageVisited, pageVisited + reportsPerPage)
    .map((report) => {
      return (
        <Card
          sx={{
            mb: 3,
            flexWrap: "wrap",
            [theme.breakpoints.down("sm")]: {
              flexDirection: "column",
              alignItems: "flex-start",
            },
          }}
          key={report._id}
        >
          <CardContent>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between", // Add this line to align the elements
                [theme.breakpoints.down("sm")]: {
                  flexDirection: "column",
                },
              }}
            >

              <div style={{ display: "flex", alignItems: "center" }}>
                {report.userName === imageName ? (
                  <Avatar src={imageProfile} alt="avatar" sx={{ mr: 3 }} />
                ) : (
                  <Avatar src={ProfileImg} alt="avatar" sx={{ mr: 3 }} />
                )}
                <div>
                  <Typography
                    className="title"
                    variant="h6"
                    component="h6"
                    sx={{
                      color: "primary.main",
                      fontWeight: "bold",
                      mb: 0,
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "14px",
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                  >
                    {report.userName}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p"
                    sx={{
                      color: report.isRead ? "green" : "inherit",
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "12px",
                      },
                    }}
                  >
                    {formatDate(report.date)}
                  </Typography>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <StarIcon
                  sx={{
                    color: report.isFavorite ? "#F5D020" : "grey",
                  }}
                  onClick={() => handleReportFavoriteToggle(report._id)}
                />
                <CheckCircleIcon
                  sx={{ color: report.isRead ? "green" : "grey" }}
                  onClick={() => handleReportReadToggle(report._id)}
                />
              </div>
            </div>
            {theme.breakpoints.up("md") && (
              <Typography
                className="reportText"
                component="p"
                sx={{
                  color: "text.primary",
                  mb: 0,
                  whiteSpace: "pre-line",
                  marginLeft: "8.55%",
                  marginTop: "2%",
                }}
              >
                {report.report}
              </Typography>
            )}
            <Typography
              variant="body2"
              component="p"
              sx={{ color: "#aaa", mb: 0, ml: "8.55%" }}
            >
              <a
                href="#!"
                className="link-grey"
                onClick={() => handelOpenDeleteModal(report._id)}
              >
                Remove
              </a>{" "}
              •
              <a href="#!" className="link-grey">
                Reply
              </a>{" "}
              •
            </Typography>
          </CardContent>
        </Card>
      );
    });



  const pageCount = Math.ceil(filteredReports.length / reportsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <section style={{ backgroundColor: "#f7f6f6" }}>
      <TextField
        type="text"
        value={searchTerm}
        sx={{ width: "20%", marginLeft: "5%" }}
        onChange={handleSearchChange} // Use handleSearchChange function
        placeholder="Search by userName"
        variant="outlined"
        fullWidth
      />
      <Button
        sx={{ mt: 5, p: 1, margin: "0% 0% 0% 62.5%" }}
        variant="outlined"
        onClick={handleOpenCreateReportModal} // Open the modal when the button is clicked
      >
        Create new report
      </Button>

      <Container sx={{ my: 5, py: 5, color: "text.primary" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component="h6"
            style={{ marginRight: "5%", marginLeft: "14%", marginBottom: "2%" }}
          >
            Sort by
          </Typography>
          <Button
            sx={{
              marginBottom: "2%",
              color: "black",
            }}
            variant="outlined"
            className="sort-buttons"
            onClick={sortByLatestDate}
          >
            Oldest Date Reports <ArrowDownwardIcon sx={{ color: "black" }} />
          </Button>
          <Button
            sx={{
              marginLeft: "1%",
              marginBottom: "2%",
              color: "black",
            }}
            variant="outlined"
            onClick={sortByNewestDate}
            className="sort-buttons"
          >
            Newest date Reports <ArrowUpwardIcon sx={{ color: "black" }} />
          </Button>
          <Button
            sx={{
              marginLeft: "1%",
              marginBottom: "2%",
              color: "black",
            }}
            variant="outlined"
            onClick={sortByFavorites}
            className="sort-buttons"
          >
            Favorite <StarIcon sx={{ color: favoriteIcon ? "#F5D020" : "grey" }} onClick={() => setFavortieIcon(prevFav => !prevFav)} />
          </Button>
          <Button
            sx={{
              marginLeft: "1%",
              marginBottom: "2%",
              color: "black",
            }}
            variant="outlined"
            onClick={sortByChecked}
            className="sort-buttons"
          >
            Checked <CheckCircleIcon sx={{ color: checked ? "green" : "grey" }} onClick={() => setChecked(prevState => !prevState)} />
          </Button>
        </div>

        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            {displayReports}
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </Grid>
        </Grid>
      </Container>
      <Modal
        open={isCreateReportModalOpen}
        onClose={handleCloseCreateReportModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <CreateReport onReportAdded={handleReportAdded} />
        </Box>
      </Modal>
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Are you sure that you want to delete this project ?
          </Typography>

          <Button
            variant="contained"
            onClick={handleCloseDeleteModal}
            sx={{ marginLeft: "0.5rem", top: "50%", left: "30%" }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleDelete}
            sx={{
              marginLeft: "0.5rem",
              backgroundColor: "#FF4371",
              color: "white",
              top: "50%",
              left: "30%",
              "&:hover": {
                backgroundColor: "#FF4371",
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </Modal>
    </section>
  );
};

export default Reports;
