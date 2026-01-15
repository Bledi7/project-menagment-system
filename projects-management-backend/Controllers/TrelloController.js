const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const API_KEY = process.env.TRELLO_API_KEY;
const TOKEN = process.env.TRELLO_API_TOKEN;


router.get("/combinedStats/:boardId", async (req, res) => {
  try {
    const boardId = req.params.boardId;

    const lists = await getListsForBoard(boardId);

    const numberOfCardsPromises = lists.map(async (list) => {
      const numberOfCards = await getNumberOfCardsInList(list.id);
      return { [list.name]: numberOfCards };
    });

    const numberOfCardsResults = await Promise.all(numberOfCardsPromises);

    const numberOfCards = numberOfCardsResults.reduce((acc, current) => ({ ...acc, ...current }), {});

    const numberOfCardsForDaysLastWeek = await getNumberOfCardsCreatedLastWeek(boardId);

    const combinedStats = {
      inToDo: numberOfCards["inToDo"] || 0,
      inDone: numberOfCards["inDone"] || 0,
      inProgress: numberOfCards["inProgress"] || 0,
      tasksCreatedPerDayLastWeek: numberOfCardsForDaysLastWeek,
    };

    res.json(combinedStats);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

 router.get("/numberOfCards/:boardId", async (req, res) => {
   try {
     const boardId = req.params.boardId; // Get the boardId from URL parameter
 
     const lists = await getListsForBoard(boardId);
 
     const numberOfCardsPromises = lists.map(async (list) => {
       const numberOfCards = await getNumberOfCardsInList(list.id);
       return { [list.name]: numberOfCards };
     });
 
     const numberOfCardsResults = await Promise.all(numberOfCardsPromises);
 
     const result = numberOfCardsResults.reduce((acc, current) => ({ ...acc, ...current }), {});
 
     res.json(result);
   } catch (error) {
     console.error("Error:", error);
     res.status(500).json({ error: "An error occurred" });
   }
 });
 
 async function getListsForBoard(boardId) {
   const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${TOKEN}`;
   const response = await fetch(url);
   const lists = await response.json();
   return lists; // Return the array of lists
 }
 
 async function getNumberOfCardsInList(listId) {
   const url = `https://api.trello.com/1/lists/${listId}/cards?key=${API_KEY}&token=${TOKEN}`;
   const response = await fetch(url);
   const cards = await response.json();
   return cards.length; // Return the number of cards in the list
 }
 

// ...

// ...
async function getDayName(date) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}

async function getNumberOfCardsCreatedForDay(date,boardId) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const url = `https://api.trello.com/1/boards/${boardId}/cards?key=${API_KEY}&token=${TOKEN}`;
  const response = await fetch(url);
  const cards = await response.json();

  const cardsForDay = cards.filter(card => {
    const cardCreationDate = new Date(card.dateLastActivity); // Use dateLastActivity or the appropriate date property
    return cardCreationDate >= startOfDay && cardCreationDate <= endOfDay;
  });

  return cardsForDay.length; // Return the number of cards for the day
}

async function getNumberOfCardsCreatedLastWeek(boardId) {
  const today = new Date();

  const numberOfCardsCreatedLastWeek = {};

  for (let i = 6; i >= 0; i--) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - i);
    const dayName = await getDayName(currentDate);
    const numberOfCardsForDay = await getNumberOfCardsCreatedForDay(currentDate,boardId);
    numberOfCardsCreatedLastWeek[dayName] = numberOfCardsForDay;
  }

  return numberOfCardsCreatedLastWeek;
}

// Example route to get the number of cards created for each day of the last week
router.get("/numberOfCardsCreatedForDaysLastWeek/:boardId", async (req, res) => {
  try {
    const boardId=req.params.boardId;
    const numberOfCardsForDaysLastWeek = await getNumberOfCardsCreatedLastWeek(boardId);
    res.json(numberOfCardsForDaysLastWeek);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});




  
module.exports = router;
