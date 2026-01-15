const express = require("express");
const messageRoute = express.Router();
const messageModel = require("../Models/Message");

messageRoute.route("/message").post(async (req, res, next) => {
  const newMessage = new messageModel(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
    next();
  } catch (err) {
    // res.status(500).json(err);
    next(err);
  }
});

messageRoute.route("/messages/:conversationId").get(async (req, res, next) => {
  try {
    const messages = await messageModel.find({
      conversationId: Number(req.params.conversationId),
    });
    res.status(200).json(messages);
    next();
  } catch (err) {
    // res.status(500).json(err);
    console.log(err);
  }
});

module.exports = messageRoute;
