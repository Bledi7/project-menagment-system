const express = require("express");
const conversationRoute = express.Router();
const conversationModel = require("../Models/Conversation");
const { getNextConversationId } = require("../Models/Counter");

// conversationRoute.route("/conversation").post(async (req, res, next) => {
//   const newConversation = new conversationModel({
//     id: await getNextConversationId(),
//     members: [req.body.senderId, req.body.receiverId],
//   });
//   try {
//     const savedConversation = await newConversation.save();
//     res.status(200).json(savedConversation);
//   } catch (error) {
//     // res.status(500).json(error);
//     next(error);
//   }
// });

conversationRoute.route("/conversation").post(async (req, res, next) => {
  const { senderId, receiverId } = req.body;
  const members = [senderId, receiverId];

  try {
    const existingConversation = await conversationModel.findOne({
      members: { $all: members },
    });

    if (existingConversation) {
      res.status(200).json(existingConversation);
    } else {
      const newConversation = new conversationModel({
        id: await getNextConversationId(),
        members: members,
      });

      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    }
  } catch (error) {
    // res.status(500).json(error);
    next(error);
  }
});

conversationRoute.route("/groupChat").post(async (req, res, next) => {
  const { members } = req.body;
  console.log(members);
  try {
    const existingConversation = await conversationModel.findOne({
      members: { $all: members },
    });

    if (existingConversation) {
      res.status(200).json(existingConversation);
    } else {
      const newConversation = new conversationModel({
        id: await getNextConversationId(),

        members: members,
      });

      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    }
  } catch (error) {
    next(error);
  }
});

conversationRoute.route("/groupChat/addUser").post(async (req, res, next) => {
  const { conversationId, userId } = req.body;

  try {
    // Find the conversation by ID
    const conversation = await conversationModel.findOne({
      id: conversationId,
    });

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
    } else {
      // Check if the user is already a member
      if (!conversation.members.includes(userId)) {
        // Add the user to the conversation members
        conversation.members.push(userId);
        await conversation.save();
      }

      res.status(200).json(conversation);
    }
  } catch (error) {
    next(error);
  }
});

conversationRoute.route("/conversation/:userId").get(async (req, res, next) => {
  try {
    const conversation = await conversationModel.find({
      members: { $in: [Number(req.params.userId)] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    // res.status(500).json(err);
    next(err);
  }
});

module.exports = conversationRoute;
