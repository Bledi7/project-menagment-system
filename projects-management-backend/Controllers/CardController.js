const express = require("express");
const CardModel = require("../Models/Card");
const cardRoute = express.Router();
const SprintModel = require("../Models/Sprint");
const { getNextSprintCardId } = require("../Models/Counter");

// Create a card and assign it to a sprint
cardRoute.route('/sprint/:sprintId').post(async (req, res, next) => {
    const sprintId = Number(req.params.sprintId);
    const { title } = req.body;
  
    try {
      const sprint = await SprintModel.findOne({ id: sprintId });
      if (!sprint) {
        return res.status(404).json({ error: 'Sprint not found' });
      }
  
      const newCard = new CardModel({
        id: await getNextSprintCardId(),
        title: title,
        sprints: [sprintId], // Store the sprint reference
      });
  
      await newCard.save();
  
      res.status(200).json({
        message: 'Card created and assigned to sprint successfully',
        card: newCard,
      });
    } catch (error) {
      console.error('Failed to create and assign card to sprint:', error);
      next(error);
    }
  });
  
  // Get all cards of a sprint
  cardRoute.route('/sprint/:sprintId').get(async (req, res, next) => {
    const sprintId = Number(req.params.sprintId);
  
    try {
      const sprint = await SprintModel.findOne({ id: sprintId }).populate('cards');
      if (!sprint) {
        return res.status(404).json({ error: 'Sprint not found' });
      }
  
      res.status(200).json({
        message: 'Cards retrieved successfully',
        cards: sprint.cards,
      });
    } catch (error) {
      console.error('Failed to retrieve cards:', error);
      next(error);
    }
  });
  
  // Get a single card by ID
  cardRoute.route('/card/:cardId').get(async (req, res, next) => {
    const cardId = Number(req.params.cardId);
  
    try {
      const card = await CardModel.findOne({ id: cardId });
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      res.status(200).json({
        message: 'Card retrieved successfully',
        card: card,
      });
    } catch (error) {
      console.error('Failed to retrieve card:', error);
      next(error);
    }
  });
  
  // Update a card by ID
  cardRoute.route('/card/:cardId').put(async (req, res, next) => {
    const cardId = Number(req.params.cardId);
    const { title } = req.body;
  
    try {
      const card = await CardModel.findOne({ id: cardId });
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      card.title = title;
      await card.save();
  
      res.status(200).json({
        message: 'Card updated successfully',
        card: card,
      });
    } catch (error) {
      console.error('Failed to update card:', error);
      next(error);
    }
  });
  
  // Delete a card by ID
  cardRoute.route('/card/:cardId').delete(async (req, res, next) => {
    const cardId = Number(req.params.cardId);
  
    try {
      const card = await CardModel.findOne({ id: cardId });
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      const sprint = await SprintModel.findOneAndUpdate(
        { cards: card._id },
        { $pull: { cards: card._id } },
        { new: true }
      );
  
      await card.remove();
  
      res.status(200).json({
        message: 'Card deleted successfully',
        card: card,
      });
    } catch (error) {
      console.error('Failed to delete card:', error);
      next(error);
    }
  });
  

module.exports = cardRoute;
