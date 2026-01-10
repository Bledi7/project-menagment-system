import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Grid, TextField, Button, Typography, Input, MenuItem, Stack, Alert, InputLabel, FormHelperText, FormControl } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Import axios for API calls
import "./updateProfile.css";
import { useDispatch } from 'react-redux';


export const updateUserProfile = (formData) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:4000/api/updateUserInfo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;

  } catch (error) {
    console.error("Error updating user information:", error);
  }
};


export default function UpdateUserProfile() {
  const userId = useSelector(state => state.user);
  const [userInfo, setUserInfo] = useState(null);
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`http://localhost:4000/api/userById/${userId._id}`);
        const data = await response.json();
        setUserInfo(data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }

    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!userInfo) {
      return; // Return early if userInfo is not available yet
    }

    // Initialize user state with properties from userInfo
    setUser({
      _id: userInfo._id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
      address: userInfo.address,
      birthday: userInfo.birthday,
      gender: userInfo.gender,
      instagram: userInfo.instagram,
      twitter: userInfo.twitter,
      gitHub: userInfo.gitHub,
      facebook: userInfo.facebook,
    });
  }, [userInfo]);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };


  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };



  const handleUpdate = async () => {
    try {

      const validationErrors = {};
      if (!user.phoneNumber.match(/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/)) {
        validationErrors.phoneNumber = "Invalid phone number format (XXX-XXX-XXX)";
      }
      else if (user.firstName.length < 3) {
        validationErrors.firstName = "Invalid name,name should contain min 3 letters";
      }
      else if (user.lastName.length < 3) {
        validationErrors.lastName = "Invalid lastName should contain min 3 letters";
      }
      else if (user.address.length < 3) {
        validationErrors.address = "Invalid address hould contain min 3 letters";
      }
      else if (user.instagram.length < 3) {
        validationErrors.instagram = "Invalid instagram,instagram should contain min 3 letters";
      }
      else if (user.facebook.length < 3) {
        validationErrors.facebook = "Invalid facebook,facebook should contain min 3 letters";
      }
      else if (user.gitHub.length < 3) {
        validationErrors.gitHub = "Invalid gitHub,gitHub should contain min 3 letters";
      }
      else if (user.twitter.length < 3) {
        validationErrors.twitter = "Invalid twitter,twitter should contain min 3 letters";
      }
      else if (user.gender.length < 3) {
        validationErrors.gender = "Invalid phoneNumber,phoneNumber should contain min 3 letters";
      }

      // Check for other validations here for other fields

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return; // Don't proceed with update if there are errors
      }
      const formData = new FormData();
      formData.append('profileImage', selectedFile);
      formData.append('_id', user._id);
      formData.append('phoneNumber', user.phoneNumber);
      formData.append('address', user.address);
      formData.append('birthday', user.birthday);
      formData.append('gender', user.gender);
      formData.append('instagram', user.instagram);
      formData.append('twitter', user.twitter);
      formData.append('gitHub', user.gitHub);
      formData.append('facebook', user.facebook);

      // Dispatch the updateUserProfile action and get the response
      const response = await dispatch(updateUserProfile(formData));
      setSuccessMessage("User information updated successfully");
      // Check if the response has a 'data' property
      if (response && response.data) {
        const updatedUserData = response.data;
        console.log('User updated in Redux:', updatedUserData);

      } else {
        console.error("Error updating user information: Response data is missing");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };


  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div id="updateUserProfile">
      {successMessage && (
        <Stack sx={{ mb: 2 }} spacing={2}>
          <Alert
            severity="success"
            sx={{
              width: "38%",
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


      <Grid container spacing={2}
        justify="center"
        alignItems="center">




        <Grid item xs={12}>

          <InputLabel htmlFor="phoneNumber">Phone Number (Format: XXX-XXX-XXX)</InputLabel>
          <TextField
            name="phoneNumber"

            value={user.phoneNumber}
            onChange={handleChange}
            error={Boolean(errors.phoneNumber)}
            inputProps={{
              pattern: "^[0-9]{3}-[0-9]{3}-[0-9]{3}$", // Validation regex
            }}

          />
          {errors.phoneNumber && (
            <FormHelperText style={{ color: 'red' }}>{errors.phoneNumber}</FormHelperText>
          )}



        </Grid>


        <Grid item xs={12}>
          <InputLabel htmlFor="birthday">Birthday</InputLabel>
          <TextField
            label=""
            name="birthday"
            type='date'
            error={Boolean(errors.birthday)}
            value={user.birthday}
            onChange={(e) => {
              const input = e.target.value;
              // Format the input to dd-mm-yyyy format
              if (input.length <= 10) {
                setUser({ ...user, birthday: input.replace(/(\d{2})(\d{2})(\d{4})/, '$1-$2-$3') });
              }
            }}
          />
           {errors.birthday && (
            <FormHelperText style={{ color: 'red' }}>{errors.birthday}</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12}>
          <InputLabel htmlFor="address">Address</InputLabel>
          <TextField
            error={Boolean(errors.address)}
            name="address"
            value={user.address}
            onChange={handleChange}
          />
                    {errors.address && (
            <FormHelperText style={{ color: 'red' }}>{errors.address}</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12}>

          <TextField
            label="Select a gender"
            name="gender"
            select
            error={Boolean(errors.gender)}
            value={user.gender}
            onChange={handleChange}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
          {errors.gender && (
            <FormHelperText style={{ color: 'red' }}>{errors.gender}</FormHelperText>
          )}
        </Grid>


        <Grid item xs={12}>
          <InputLabel htmlFor="instagram">Instagram</InputLabel>
          <TextField
            name="instagram"

            value={user.instagram}
            error={Boolean(errors.instagram)}
            onChange={handleChange}
          />
                    {errors.instagram && (
            <FormHelperText style={{ color: 'red' }}>{errors.instagram}</FormHelperText>
          )}
        </Grid>


        <Grid item xs={12}>
          <InputLabel htmlFor="facebook">Facebook</InputLabel>
          <TextField
            name="facebook"
            value={user.facebook}
            onChange={handleChange}
            error={Boolean(errors.facebook)}
          />
                    {errors.facebook && (
            <FormHelperText style={{ color: 'red' }}>{errors.facebook}</FormHelperText>
          )}
        </Grid>


        <Grid item xs={12}>
          <InputLabel htmlFor="twitter">Twitter</InputLabel>
          <TextField
            name="twitter"
            value={user.twitter}
            onChange={handleChange}
            error={Boolean(errors.twitter)}
          />
                    {errors.twitter && (
            <FormHelperText style={{ color: 'red' }}>{errors.twitter}</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12}>
          <InputLabel htmlFor="gitHub">GitHub</InputLabel>
          <TextField
            name="gitHub"
            value={user.gitHub}
            onChange={handleChange}
            error={Boolean(errors.gitHub)}
          />
                    {errors.gitHub && (
            <FormHelperText style={{ color: 'red' }}>{errors.gitHub}</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} sx={{ width: '300px' }}>

          <Typography>Profile Picture</Typography>
          <Input
            type="file"
            name="profileImage"
            onChange={handleFileChange}
            inputProps={{ accept: 'image/*' }} // Accept only image files
          />

        </Grid>


        <Grid item xs={12}>

          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update User Info
          </Button>


        </Grid>


      </Grid>
    </div>
  );
}
