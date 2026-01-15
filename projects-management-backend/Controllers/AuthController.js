const express = require("express");
const admin = require("firebase-admin");
let UserModel = require("../Models/User");
const axios = require("axios");
const app = express();
const dotenv = require("dotenv");
const authRoute = express.Router();

dotenv.config({ path: "../config.env" });

const authenticateUser = async (req, res, next) => {
  const idToken = req.headers.authorization;

  if (!idToken) {
    return res.status(400).json({ message: "No token provided." });
  }

  try {
    const userRecord = await admin.auth().verifyIdToken(idToken);

    const currentUser = await UserModel.findOne({
      email: userRecord.email,
    });
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Access token has expired.", error);
    return res.status(401).json({ message: "Access token has expired." });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

authRoute.route("/exchangeToken").post(async (req, res) => {
  try {
    const refreshToken = req.headers.authorization; //refresh token
    const APIKey = process.env.FIREBASE_API_KEY;
    const url = `https://securetoken.googleapis.com/v1/token?key=${APIKey}`;

    const payload = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

    const response = await axios.post(url, payload);
    const responseData = response.data;

    if (response.status === 200) {
      const expiresIn = responseData.expires_in;
      const tokenType = responseData.token_type;
      const newRefreshToken = responseData.refresh_token;
      const idToken = responseData.id_token;
      const userId = responseData.user_id;
      const projectId = responseData.project_id;

      console.log("Token exchange successful!");
      console.log("ID Token:", idToken);
      console.log("User ID:", userId);

      res.status(200).json({ idToken });
    } else {
      const errorMessage = responseData.error || "Unknown error";
      console.log("Token exchange failed:", errorMessage);

      res.status(response.status).json({ error: errorMessage });
    }
  } catch (error) {
    // Handle any exceptions
    console.error("Token exchange failed:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {authRoute, authenticateUser, restrictTo };