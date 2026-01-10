import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { loginUser } from "../../Atoms/helpers/api";
import { useDispatch } from "react-redux";
import {
  setAccessToken,
  setRefreshToken,
  setExpiresTime,
  setUser,
} from "../../../redux/userSlice";
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "../../Atoms/helpers/logo";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const auth = getAuth();
  const dispatch = useDispatch();
  const isMounted = useRef(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");

    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    setIsFormValid(email !== "" && password !== "");
  }, [email, password]);

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
  }, [rememberMe, email, password]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userData = await signInWithEmailAndPassword(auth, email, password);

      if (isMounted.current && userData && userData._tokenResponse.registered) {
        const response = await loginUser(
          email,
          password,
          userData._tokenResponse.idToken
        );
        dispatch(setAccessToken(userData.user.stsTokenManager.accessToken));
        dispatch(setRefreshToken(userData.user.stsTokenManager.refreshToken));
        dispatch(setExpiresTime(userData.user.stsTokenManager.expirationTime));
        console.log(response);
        switch (response.role) {
          case "Admin":
            dispatch(setUser(response));
            navigate("/admin");

            break;
          case "Product Owner":
            dispatch(setUser(response));
            navigate("/productOwner");

            break;
          case "Scrum Master":
            dispatch(setUser(response));
            navigate("/scrumMaster");

            break;
          case "Developer":
            dispatch(setUser(response));
            navigate("/developer");

            break;
          default:
            setErrorMessage("Invalid email or password");
            break;
        }
      }
    } catch (error) {
      setErrorMessage("Invalid email or password");
      console.error(error);
    }

    setEmail("");
    setPassword("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  return (
    <Box className="login-bg">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid #ccc",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "3px",
            padding: "15px",
          }}
        >
          <Logo sx={{ width: 70, height: 70, mb: 2 }} />
          <Typography
            component="h1"
            variant="h5"
            sx={{ margin: "20px 0", textAlign: "center" }}
          >
            LOGIN
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignIn}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handleInputChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isFormValid}
            >
              Log In
            </Button>
            {errorMessage && (
              <Typography
                color="error"
                variant="body2"
                align="center"
                sx={{ mt: 2 }}
              >
                {errorMessage}
              </Typography>
            )}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Register"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
