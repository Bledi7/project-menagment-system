import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setUser,
  setAccessToken,
  setRefreshToken,
  setExpiresTime,
} from "../../../redux/userSlice";
import { Link } from "react-router-dom";
import { registerUser } from "../../Atoms/helpers/api";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Container,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import "./register.css";
import Logo from "../../Atoms/helpers/logo";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    .min(3, "First Name: at least 3 characters"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .min(3, "Last Name: at least 3 characters"),
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
    .min(8, "Password: at least 8 characters"),
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .min(8, "Phone Number: at least 8 characters"),
  birthday: yup
    .string()
    .required("Birthday is required")
    .min(8, "Birthday: at least 8 characters"),
  gender: yup
    .string()
    .required("Gender is required")
    .min(4, "Gender: at least 4 characters"),
});

const Register = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const dispatch = useDispatch();

  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("email", "");
    setValue("password", "");
    setValue("phoneNumber", "");
    setValue("birthday", "");
    setValue("gender", "");
  }, [setValue]);

  const handleRegister = async (data) => {
    try {
      const userData = { ...data, role: "Developer" };
      const newUser = await registerUser(userData);

      setIsRegistered(true);

      dispatch(setUser(newUser));
      const { accessToken, refreshToken, expiresTime } = newUser;
      dispatch(setAccessToken(accessToken));
      dispatch(setRefreshToken(refreshToken));
      dispatch(setExpiresTime(expiresTime));

      setErrorMessage("");

      setValue("firstName", "");
      setValue("lastName", "");
      setValue("email", "");
      setValue("password", "");
      setValue("phoneNumber", "");
      setValue("birthday", "");
      setValue("gender", "");
    } catch (error) {
      console.error(error);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <Box className="register-bg">
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid #ccc",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            padding: "20px",
          }}
        >
          <Logo sx={{ width: 70, height: 70, mb: 2 }} />
          {isRegistered ? (
            <Box>
              <Typography
                variant="h5"
                sx={{ marginTop: "15px", textAlign: "center" }}
              >
                You have successfully registered in the StarLabs Projects
                Management System (PMS).
              </Typography>
              <Typography
                variant="body1"
                sx={{ marginTop: "30px", textAlign: "center" }}
              >
                Now click the button below to log in to your account.
              </Typography>
              <Box sx={{ marginTop: "30px" }}>
                <Button
                  component={Link}
                  to="/login"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Log In
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit(handleRegister)}
              noValidate
              sx={{ mt: 1 }}
            >
              <Typography
                component="h1"
                variant="h5"
                sx={{ margin: "20px 0", textAlign: "center" }}
              >
                REGISTER
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        autoComplete="given-name"
                        error={Boolean(errors.firstName)}
                        helperText={errors.firstName?.message || ""}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        error={Boolean(errors.lastName)}
                        helperText={errors.lastName?.message || ""}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />

                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="birthday"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        margin="normal"
                        type="date"
                        required
                        fullWidth
                        id="birthday"
                        name="birthday"
                        autoComplete="family-name"
                        error={Boolean(errors.lastName)}
                        helperText={errors.birthday?.message || ""}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                  
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="gender"
                        label="Gender"
                        name="gender"
                        autoComplete="family-name"
                        error={Boolean(errors.lastName)}
                        helperText={errors.gender?.message || ""}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                  
     
                  
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="phoneNumber"
                        label="Phone Number"
                        name="phoneNumber"
                        autoComplete="family-name"
                        error={Boolean(errors.lastName)}
                        helperText={errors.phoneNumber?.message || ""}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                  
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        type="email"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message || ""}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message || ""}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={Object.keys(errors).length !== 0}
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              {Object.keys(errors).length !== 0 && (
                <Typography
                  variant="caption"
                  color="error"
                  component="p"
                  align="center"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Please ensure all mandatory fields are filled out accurately.
                </Typography>
              )}

              {errorMessage && (
                <Typography
                  variant="caption"
                  color="error"
                  component="p"
                  align="center"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {errorMessage}
                </Typography>
              )}
              <Typography variant="body2" align="center">
                Already Registered? <Link to="/login">Log in</Link>
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
