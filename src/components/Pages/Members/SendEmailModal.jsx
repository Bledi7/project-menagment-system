import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useRef, useEffect } from "react";
import "./email.css";
import CloseIcon from "@mui/icons-material/Close";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import axios from "axios";
import { TroubleshootRounded } from "@mui/icons-material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
import * as yup from "yup";

const schema = yup.object().shape({
  emailReceivers: yup
    .array()
    .of(
      yup.string().email("Invalid email address").required("Email is required")
    )
    .min(1, "At least one email is required"),
  message: yup
    .string()
    .required("A message is required")
    .min(5, "Message: at least 5 characters"),
  subject: yup
    .string()
    .required("Subject is required")
    .min(3, "Subject: at least 3 characters"),
});

export function SendEmailModal({ open, handleClose }) {
  const team = useSelector((state) => state.teams);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const overlayRef = useRef(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleEmails = async () => {
    try {
      const emailData = {
        // Change with the logged-in user's email
        emailSender: team.leads[0].email,
        emailReceivers: selectedEmployees, // Assuming selectedEmployees is an array of email addresses
        message: message,
        subject: subject,
      };

      // Send a POST request to your backend endpoint
      const response = await axios.post(
        "http://localhost:4000/api/message-Email",
        emailData
      );
      setSubject("");
      setMessage("");
      setSelectedEmployees([]);

      setSuccessAlert(true);
      setTimeout(() => {
        setSuccessAlert(false);
      }, 3000);
      handleClose(true);
      console.log("Email Sent:", response.data);
    } catch (error) {
      setErrorAlert(true);
      handleClose(true);
      console.error("Error sending Email:", error);
    }
  };
  const closeModal = () => {
    handleClose(true);
  };
  const closeAlert = () => {
    setSuccessAlert(false);
    setErrorAlert(false);
  };
  return (
    <>
      {successAlert ||
        (errorAlert && <div className="overlay" ref={overlayRef} />)}

      {successAlert === true && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert
            severity="success"
            style={{
              borderRadius: "10px",
              position: "absolute",
              top: "10px",
              zIndex: "10001",
            }}
          >
            <AlertTitle>Success</AlertTitle>
            <div
              style={{
                display: "grid",
                alignItems: "center",
                gridAutoFlow: "column",
                gap: "1.3rem",
              }}
            >
              <div> Email sent successfully</div>{" "}
              <CloseIcon
                onClick={closeAlert}
                style={{ cursor: "pointer" }}
              ></CloseIcon>
            </div>
          </Alert>
        </Stack>
      )}

      {errorAlert && (
        <Alert
          severity="error"
          style={{
            borderRadius: "10px",
            position: "absolute",
            top: "10px",
            zIndex: "10001",
          }}
        >
          <AlertTitle>Error</AlertTitle>
          <div
            style={{
              display: "grid",
              alignItems: "center",
              gridAutoFlow: "column",
              gap: "1.3rem",
            }}
          >
            <div> There was an error sending the email. Please try again.</div>{" "}
            <CloseIcon
              onClick={closeAlert}
              style={{ cursor: "pointer" }}
            ></CloseIcon>
          </div>
        </Alert>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            variant="h5"
            fontWeight="600"
            marginBottom="20px"
            paddingBottom="5px"
            style={{ borderBottom: "1px solid black" }}
          >
            Send Email{" "}
          </Typography>{" "}
          <Controller
            control={control}
            name="subject"
            render={({ field }) => (
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ marginBottom: "15px" }}
              />
            )}
          ></Controller>
          <FormControl fullWidth sx={{ marginBottom: "10px" }}>
            <InputLabel>Select Employees To Send Email</InputLabel>
            <Controller
              control={control}
              name="emailReceivers"
              render={({ field }) => (
                <Select
                  multiple
                  value={selectedEmployees}
                  onChange={(e) => setSelectedEmployees(e.target.value)}
                  renderValue={(selected) =>
                    selected
                      .map((email) => {
                        const user = team.employees.find(
                          (user) => user.email === email
                        );
                        return user ? `${user.firstName} ${user.lastName}` : "";
                      })
                      .join(", ")
                  }
                >
                  {team.employees.map((user) => (
                    <MenuItem key={user._id} value={user.email}>
                      <Checkbox
                        checked={selectedEmployees.indexOf(user._id) > -1}
                      />
                      <ListItemText
                        primary={`${user.firstName} ${user.lastName}`}
                      />
                    </MenuItem>
                  ))}
                </Select>
              )}
            ></Controller>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "10px" }}>
            <Controller
              control={control}
              name="message"
              render={({ field }) => (
                <textarea
                  placeholder="Type a Message"
                  style={{
                    fontWeight: "400",
                    fontVariant: "h5",
                    fontFamily: "sans-serif",
                    borderColor: "#c4c4c4",
                    borderRadius: "3px",
                    padding: "16.5px 14px",
                    fontSize: "1.02rem",
                    lineHeight: "1.43rem",
                    color: "black",
                    resize: "none",
                    width: "100%",
                    overflow: "hidden",
                  }}
                  value={message}
                  rows={6}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              )}
            ></Controller>
          </FormControl>
          <div style={{ display: "grid", gridAutoFlow: "column", gap: "1rem" }}>
            <Button
              variant="contained"
              onClick={handleEmails}
              noValidate
              sx={{ width: "100%", borderRadius: "8px" }}
            >
              Send
            </Button>
            <Button
              variant="contained"
              onClick={closeModal}
              sx={{ width: "100%", borderRadius: "8px" }}
            >
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
