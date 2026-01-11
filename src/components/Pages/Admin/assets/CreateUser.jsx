import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../../styles/style";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { registerUser } from "../../../Atoms/helpers/api";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    .min(3, "First Name must have at least 3 characters"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .min(3, "Last Name must have at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Please enter a valid email address"
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must have at least 8 characters"),
  role: yup.string().required("Role is required"),
});

const CreateUser = ({ handleClose, onUserCreated }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [isUserCreated, setIsUserCreated] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateUser = async (data) => {
    try {
      const newUser = await registerUser(data);
      console.log("User created:", newUser);
      setIsUserCreated(true);
      onUserCreated(newUser);
    } catch (error) {
      console.error("Failed to create user:", error);
      setError("Failed to create user. Please try again later.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open onClose={handleClose}>
        <DialogContent>
          {isUserCreated ? (
            <Box p={2}>
              <Typography variant="h6" align="center">
                You have successfully created a user.
              </Typography>
              <Box textAlign="center" mt={2}>
                <Button
                  onClick={() => {
                    handleClose();
                    setIsUserCreated(false);
                  }}
                  variant="contained"
                  color="primary"
                >
                  Close
                </Button>
              </Box>
            </Box>
          ) : (
            <Box p={2}>
              <form onSubmit={handleSubmit(handleCreateUser)}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          style={{ width: "100%" }}
                          label="First Name"
                          {...field}
                          error={Boolean(errors.firstName)}
                          helperText={errors.firstName?.message || ""}
                          required
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          style={{ width: "100%" }}
                          label="Last Name"
                          {...field}
                          error={Boolean(errors.lastName)}
                          helperText={errors.lastName?.message || ""}
                          required
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          style={{ width: "100%" }}
                          label="Email"
                          type="email"
                          {...field}
                          error={Boolean(errors.email)}
                          helperText={errors.email?.message || ""}
                          required
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          style={{ width: "100%" }}
                          label="Password"
                          type="password"
                          {...field}
                          error={Boolean(errors.password)}
                          helperText={errors.password?.message || ""}
                          required
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          required
                          style={{ width: "100%" }}
                          error={Boolean(errors.role)}
                        >
                          <InputLabel>Select Role</InputLabel>
                          <Select {...field} value={field.value || ""}>
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="Product Owner">
                              Product Owner
                            </MenuItem>
                            <MenuItem value="Scrum Master">
                              Scrum Master
                            </MenuItem>
                            <MenuItem value="Developer">Developer</MenuItem>
                          </Select>
                          {errors.role && (
                            <Typography
                              variant="caption"
                              color="error"
                              component="p"
                              sx={{ mt: 0.5 }}
                            >
                              {errors.role?.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit" variant="contained" color="primary">
                    Create
                  </Button>
                </DialogActions>
              </form>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

CreateUser.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default CreateUser;
