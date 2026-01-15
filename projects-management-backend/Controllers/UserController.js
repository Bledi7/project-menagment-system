const express = require("express");
const userRoute = express.Router();
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
let UserModel = require("../Models/User");
const auth = require("./AuthController");
const Counter = require("../Models/Counter");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
const serviceAccount = require("../serviceAccountKey.json");
const multer = require('multer'); // Import multer for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


userRoute.route("/register").post(async (req, res, next) => {
  const { firstName, lastName, email, password, role, status } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const id = await Counter.getNextUserId();
    const newUser = new UserModel({
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      role: role,
    });

    await newUser.save();
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    res.status(200).json({
      message: "User registered successfully",
      user: newUser,
      token: userRecord,
    });
  } catch (error) {
    console.error("User registration failed:", error);
    next(error);
  }
});

userRoute.route("/login").post(async (req, res, next) => {
  const idToken = req.headers.authorization;
  if (!idToken) {
    return res.status(401).json({ message: "No token provided." });
  }
  try {
    const userRecord = await admin.auth().verifyIdToken(idToken);
    // console.log(userRecord);
    const getUserFromDatabase = await UserModel.findOne({
      email: userRecord.email,
    });
    if (!getUserFromDatabase) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      message: "Login successful",
      user: getUserFromDatabase,
    });
  } catch (error) {
    console.error("Login failed:", error);
    next(error);
  }
});

userRoute.route("/users").get(async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({
      message: "Users retrieved successfully",
      users: users,
    });
  } catch (error) {
    console.error("Failed to retrieve users:", error);
    next(error);
  }
});

userRoute.route('/getProfilePicture/:userId').get(async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);

    if (!user || !user.profileImage) {
      return res.status(404).json({ message: 'User or profile image not found' });
    }

    const image = fs.readFileSync(user.profileImage.path);
    res.setHeader('Content-Type', user.profileImage.contentType);
    res.send(image);
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

userRoute.route("/userById/:userId").get(async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    next(error);
  }
});

userRoute.route('/updateUserInfo').post(upload.single('profileImage'), async (req, res, next) => {
  const userId = req.body._id;
  const {
    phoneNumber,
    address,
    birthday,
    gender,
    instagram,
    twitter,
    gitHub,
    facebook,
  } = req.body;

  const updatedUserData = {
    phoneNumber,
    address,
    birthday,
    gender,
    instagram,
    twitter,
    gitHub,
    facebook,
  };

  if (req.file) {
    // Handle the uploaded profile image
    updatedUserData.profileImage = {
      path: req.file.path,
      contentType: req.file.mimetype,
    };
  }

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: updatedUserData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Save the updated user with new profile image data
    await updatedUser.save();

    res.status(200).json({
      message: 'User information updated successfully',
      updatedUser: {
        ...updatedUser.toObject(),
      },
    });
  } catch (error) {
    console.error('Failed to update user information:', error);
    next(error);
  }
});

userRoute.route("/users/:id").delete(async (req, res, next) => {
  const userId = Number(req.params.id);
  try {
    const deletedUser = await UserModel.findOneAndDelete({ id: userId });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = await admin.auth().getUserByEmail(deletedUser.email);
    console.log(user);
    const uid = user.uid;
    try {
      await admin.auth().deleteUser(uid);
      console.log("User deleted successfully from firebase");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    res.status(200).json({
      message: "User deleted successfully from database",
      deletedUser: deletedUser,
    });
  } catch (error) {
    console.error("Failed to delete user:", error);
    next(error);
  }
});

userRoute.route("/users/:id").put(async (req, res, next) => {
  const userId = Number(req.params.id);
  const { firstName, lastName, email, password, role,status } = req.body;

  const updatedUserData = {
    firstName,
    lastName,
    email,
    role,
    status
  };

  try {
    const oldUser = await UserModel.findOne({ id: userId });
    if (!oldUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedUserData.password = hashedPassword;
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { id: userId },
      updatedUserData,
      { new: true }
    );

    if (email && password) {
      const user = await admin.auth().getUserByEmail(oldUser.email);
      const uid = user.uid;
      try {
        await admin.auth().updateUser(uid, {
          email,
          password,
        });
        console.log("User updated successfully in Firebase");
      } catch (error) {
        console.error("Error updating user in Firebase:", error);
      }
    }
    res.status(200).json({
      message: "User updated successfully",
      updatedUser: updatedUser,
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    next(error);
  }
});

userRoute.route("/randomUsers").get(async (req, res, next) => {
  try {
    const loggedInUserId = req.body.id; // Assuming the logged-in user's ID is available in the request (you may have a different method to obtain this).

    // Fetch the first 4 users (excluding the logged-in user) from the UserModel
    const firstUsers = await UserModel.find({
      id: { $ne: loggedInUserId },
    }).limit(4);

    res.status(200).json({
      users: firstUsers,
    });
  } catch (error) {
    console.error("Failed to retrieve first users:", error);
    next(error);
  }
});

module.exports = userRoute;
