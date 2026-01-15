const express = require("express");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const emailRoute = express.Router();
const UserModel = require("../Models/User");
const axios = require("axios");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const generateEmailContent = require("../Assets/EmailTemplate");
const messageEmail = require("../Assets/MessageEmailTemplate");

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

emailRoute.route("/message-Email").post(async (req, res, next) => {
  const { emailSender, emailReceivers, message, subject } = req.body;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const SenderData = await UserModel.findOne({ email: emailSender });
  console.log(SenderData);
  const sender = {
    email: emailSender,
    name: SenderData.firstName,
  };
  try {
    // const usersWithRole = await UserModel.findOne({ email: receiverEmail });
    // console.log(usersWithRole.email);
    const htmlContent = messageEmail(message, SenderData.firstName);
    const email = emailReceivers.map((email) => {
      return {
        email: email,
      };
    });
    const sendemail = await apiInstance.sendTransacEmail({
      sender,
      to: email,
      subject: subject,
      textContent: "text",
      htmlContent: htmlContent,
    });

    return res.send(sendemail);
  } catch (error) {
    next(error);
  }
});

emailRoute.route("/email").post(async (req, res, next) => {
  const { senderEmail, senderName, receiverEmail } = req.body;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sender = {
    email: senderEmail,
    name: senderName,
  };
  try {
    const usersWithRole = await UserModel.findOne({ email: receiverEmail });
    console.log(usersWithRole.email);
    const htmlContent = generateEmailContent(usersWithRole.firstName);
    const email = [
      {
        email: usersWithRole.email,
      },
    ];
    const sendemail = await apiInstance.sendTransacEmail({
      sender,
      to: email,
      subject: "test",
      textContent: "text",
      htmlContent: htmlContent,
    });

    return res.send(sendemail);
  } catch (error) {
    next(error);
  }
});

// emailRoute.route("/email").post(async (req, res, next) => {
//   const { senderEmail, senderName, roleTargeted } = req.body;
//   const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
//   const sender = {
//     email: senderEmail,
//     name: senderName,
//   };

//   try {
//     const usersWithRole = await UserModel.find({ role: roleTargeted });

//     const recievers = usersWithRole.map((user) => ({
//       email: user.email,
//     }));
//     console.log(recievers);
//     const sendemail = await apiInstance.sendTransacEmail({
//       sender,
//       to: recievers,
//       subject: "test",
//       textContent: "text",
//       htmlContent: "<h1> test</h1>",
//     });

//     return res.send(sendemail);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = emailRoute;
