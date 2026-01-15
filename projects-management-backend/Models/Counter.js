const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, default: 0 },
});

const CounterModel = mongoose.model("Counter", counterSchema);

const getNextUserId = async () => {
  const counter = await CounterModel.findByIdAndUpdate(
    { _id: "userId" },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );

  return counter.sequenceValue;
};

const getNextSprintId = async () => {
  const counter = await CounterModel.findByIdAndUpdate(
    { _id: "sprintId" },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );

  return counter.sequenceValue;
};

const getNextSprintCardId = async () => {
  const counter = await CounterModel.findByIdAndUpdate(
    { _id: "sprintCardId" },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );

  return counter.sequenceValue;
};

const getNextConversationId = async () => {
  const counter = await CounterModel.findByIdAndUpdate(
    { _id: "conversationId" },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );

  return counter.sequenceValue;
};

module.exports = {
  getNextUserId,
  getNextSprintId,
  getNextSprintCardId,
  getNextConversationId
};
