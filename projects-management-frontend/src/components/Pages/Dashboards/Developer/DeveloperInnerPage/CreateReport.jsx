import { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";

function CreateReport({ onReportAdded}) {
  const userInfo = useSelector((state) => state.user);
  const { firstName } = userInfo;
 
  
console.log('userInfo', userInfo)
  const [report, setReport] = useState({
    userName:"",
    date: "",
    report: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const imageUrl = `http://localhost:4000/api/getProfilePicture/${userInfo._id}`;

  const handleChange = (e) => {
    setReport({ ...report, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/api/createReport",{... report,userName:firstName})
      .then((response) => {
        setSuccessMessage("Report submitted successfully!");
        console.log('dsd',userInfo._id)
        onReportAdded(response.data,imageUrl,userInfo.firstName);
        setReport({ id: "",userName:"",date: "", report: "" });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div>
      <div>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
        >
          <div>
            <h2>Create Report</h2>
            {successMessage && (
              <Stack sx={{ mb: 2 }} spacing={2}>
                <Alert
                  severity="success"
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    padding: "1rem",
                    transition: "opacity 0.5s ease-in-out",
                    opacity: successMessage ? 1 : 0,
                  }}
                >
                  {successMessage}
                </Alert>
              </Stack>
            )}
            <form onSubmit={handleSubmit}>
      
              <TextField
                label="Date"
                name="date"
                value={report.date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Write Report"
                name="report"
                value={report.report}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
              />
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default CreateReport;