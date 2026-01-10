import React, { useState ,useEffect} from 'react';
import { useSelector } from 'react-redux';
import ProfileImg from '../../Atoms/images/ProfileImg.jpg.png'
import { Card, Avatar, CardContent, Typography, Button, TableContainer, Table, TableCell, TableHead, TableRow, TableBody, IconButton, Grid } from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import LinearProgress from "@mui/material/LinearProgress";
import Divider from '@mui/material/Divider';
import "../Dashboards/ScrumMaster/projects/Projects.css";
import "../User/profilePage.css";
import CircularProgress from '@mui/material/CircularProgress';
function profilePage() {

    const userId = useSelector(state => state.user);
    const [userInfo,setUserInfo]=useState(null);
   

    useEffect(() => {
        async function fetchUser() {
            console.log('userId._id', userId._id)
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
    const imageUrl = `http://localhost:4000/api/getProfilePicture/${userId._id}`;
   
    const formatBirthday = (birthday) => {
        const date = new Date(birthday);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based
        const year = date.getFullYear();
        return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
    };
    if (!userInfo) {
        return <CircularProgress
        color="primary"
        size={30}

        thickness={5}
        sx={{top:50,left:50}}
      />;
      }
    return (
        <div id='user-profile-container' style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", margin: "4% 0% 0% 10%" }}>

            <Card
                id='elementary-info'
                sx={{
                    position: "relative",
                    width: "35%",
                    height: "35%",
                    left: "5%",
                    top: "8%"
                }}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center", // Center items horizontally
                        justifyContent: "center", // Center items vertically
                        textAlign: "center", // Center text horizontally
                    }}
                >

                     <Avatar src={imageUrl} alt="avatar" sx={{ width: 120, height: 120, marginTop: "5%" }} />

                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            color: "primary.main",
                            fontWeight: "bold",
                            mb: 0,
                            fontSize: "26px",
                            marginTop: "5%",

                        }}
                    >
                        {userInfo.firstName} {userInfo.lastName}
                    </Typography>
                    <Typography

                        component="p"
                        sx={{
                            color: "grey",
                            fontSize: "16px",
                            marginTop: "3%",
                        }}
                    >
                        Full Stack Developer
                    </Typography>

                    <Button sx={{ mt: 3 }} variant="contained" >
                        View biography

                    </Button>

                </CardContent>

            </Card>
            <Card id='secondary-info' sx={{ marginLeft: '10%', height: "35%", width: "40%" }}>
                <TableContainer >
                    <Table size="small" aria-label="a dense table" sx={{ width: '100%', height: "35%" }}>

                        <TableBody>

                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    First Name
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{userInfo.firstName}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    Last Name
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{userInfo.lastName}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    Phone number
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{userInfo.phoneNumber}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    Address
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{userInfo.address}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    Email
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{userInfo.email}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    Birthday
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{formatBirthday(userInfo.birthday)}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    Gender
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{userInfo.gender}</TableCell>

                            </TableRow>


                        </TableBody>
                    </Table>
                </TableContainer>

            </Card>

            <Card id='social-network-info' sx={{ height: "38%", width: "35%", marginLeft: "5%", marginTop: "2%" }}>
                <TableContainer >
                    <Table size="small" aria-label="a dense table" sx={{ width: '100%' }}>

                        <TableBody>

                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold", color: "black" }}>
                                    <div style={{ display: 'flex' }}>
                                        <IconButton><LanguageIcon /></IconButton><p style={{ color: "black", marginTop: "7%" }}>Website</p>
                                    </div>


                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}> http://projectManagement</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    <div style={{ display: 'flex' }}>
                                        <IconButton><InstagramIcon /></IconButton><p style={{ color: "black", marginTop: "7%" }}>Instagram</p>
                                    </div>
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{userInfo.instagram}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    <div style={{ display: 'flex' }}>
                                        <IconButton><GitHubIcon /></IconButton><p style={{ color: "black", marginTop: "7%" }}>GitHub</p>
                                    </div>
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{userInfo.gitHub}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    <div style={{ display: 'flex' }}>
                                        <IconButton><TwitterIcon /></IconButton><p style={{ color: "black", marginTop: "7%" }}>Twitter</p>
                                    </div>
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{userInfo.twitter}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    <div style={{ display: 'flex' }}>
                                        <IconButton><EmailIcon /></IconButton><p style={{ color: "black", marginTop: "7%" }}>Email</p>
                                    </div>
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{userInfo.email}</TableCell>

                            </TableRow>

                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    <div style={{ display: 'flex' }}>
                                        <IconButton><FacebookOutlinedIcon /></IconButton><p style={{ color: "black", marginTop: "7%" }}>Facebook</p>
                                    </div>
                                </TableCell>

                                <TableCell align="left" sx={{ marginRight: "40%" }}>{userInfo.facebook}</TableCell>

                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>

            </Card>
            <Card id='skills' sx={{ height: "35%", width: "40%", marginLeft: "5%", marginTop: "-6.22%" }}>
                <CardContent >
                    <div id='skills'>
                        <Typography
                            component="h6"  // Corrected this line
                            variant='h6'
                            align='center'
                        >
                            Skills
                        </Typography>
                        <Typography
                            component="h6"
                            variant='h6'
                            align='left'
                        >
                            React
                        </Typography>
                        <Typography variant="body2" component="p" align='right'>
                            60%
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value='60'
                            sx={{
                                width: "100%",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#1AD993",
                                },
                                "& .MuiLinearProgress-root": {
                                    backgroundColor: "grey",
                                },

                            }}
                        />

                        <Divider sx={{ my: 2 }} />
                        <Typography


                            variant="h6" component="h1" marginTop={"5%"}
                        >
                            Vue
                        </Typography>
                        <Typography variant="body2" component="p" align='right'>
                            80%
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value='80'
                            sx={{
                                width: "100%",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#1AD993",
                                },
                                "& .MuiLinearProgress-root": {
                                    backgroundColor: "grey",
                                },

                            }}
                        />

                        <Divider sx={{ my: 2 }} />
                        <Typography


                            variant="h6" component="h1" marginTop={"5%"}
                        >
                            Node
                        </Typography>
                        <Typography variant="body2" component="p" align='right'>
                            40%
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value='40'
                            sx={{
                                width: "100%",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#1AD993",
                                },
                                "& .MuiLinearProgress-root": {
                                    backgroundColor: "grey",
                                },

                            }}
                        />

                        <Divider sx={{ my: 2 }} />
                        <Typography


                            variant="h6" component="h1" marginTop={"5%"}
                        >
                            Asp.net
                        </Typography>
                        <Typography variant="body2" component="p" align='right'>
                            80%
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value='80'
                            sx={{
                                width: "100%",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#1AD993",
                                },
                                "& .MuiLinearProgress-root": {
                                    backgroundColor: "grey",
                                },

                            }}
                        />




                    </div>
                </CardContent>
            </Card>

        </div>
    )
}

export default profilePage
