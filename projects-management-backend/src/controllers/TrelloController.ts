import { Router, Request, Response } from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { asyncHandler } from "@utils/errorHandler";
import { BadRequestError } from "@utils/errors";
import { authenticateJWT, restrictTo } from "@middleware/auth";
import { validateParams } from "@middleware/validation";
import { z } from "zod";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../config.env") });

const router = Router();

const API_KEY = process.env.TRELLO_API_KEY;
const TOKEN = process.env.TRELLO_API_TOKEN;

/**
 * Get lists for a board
 */
async function getListsForBoard(boardId: string): Promise<any[]> {
  if (!API_KEY || !TOKEN) {
    throw new BadRequestError("Trello API credentials not configured");
  }

  const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${TOKEN}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch lists for board ${boardId}`);
  }

  return await response.json();
}

/**
 * Get number of cards in a list
 */
async function getNumberOfCardsInList(listId: string): Promise<number> {
  if (!API_KEY || !TOKEN) {
    throw new BadRequestError("Trello API credentials not configured");
  }

  const url = `https://api.trello.com/1/lists/${listId}/cards?key=${API_KEY}&token=${TOKEN}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch cards for list ${listId}`);
  }

  const cards = await response.json();
  return cards.length;
}

/**
 * Get day name from date
 */
function getDayName(date: Date): string {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getDay()];
}

/**
 * Get number of cards created for a specific day
 */
async function getNumberOfCardsCreatedForDay(date: Date, boardId: string): Promise<number> {
  if (!API_KEY || !TOKEN) {
    throw new BadRequestError("Trello API credentials not configured");
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const url = `https://api.trello.com/1/boards/${boardId}/cards?key=${API_KEY}&token=${TOKEN}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch cards for board ${boardId}`);
  }

  const cards = await response.json();

  const cardsForDay = cards.filter((card: any) => {
    const cardCreationDate = new Date(card.dateLastActivity);
    return cardCreationDate >= startOfDay && cardCreationDate <= endOfDay;
  });

  return cardsForDay.length;
}

/**
 * Get number of cards created last week
 */
async function getNumberOfCardsCreatedLastWeek(boardId: string): Promise<{ [key: string]: number }> {
  const today = new Date();
  const numberOfCardsCreatedLastWeek: { [key: string]: number } = {};

  for (let i = 6; i >= 0; i--) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - i);
    const dayName = getDayName(currentDate);
    const numberOfCardsForDay = await getNumberOfCardsCreatedForDay(currentDate, boardId);
    numberOfCardsCreatedLastWeek[dayName] = numberOfCardsForDay;
  }

  return numberOfCardsCreatedLastWeek;
}

/**
 * Get combined statistics for a board (Protected)
 * GET /api/trello/combined-stats/:boardId
 */
router.get(
  "/trello/combined-stats/:boardId",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateParams(z.object({ boardId: z.string().min(1) })),
  asyncHandler(async (req: Request, res: Response) => {
    const boardId = req.params.boardId;

    if (!boardId) {
      throw new BadRequestError("Board ID is required");
    }

    const lists = await getListsForBoard(boardId);

    const numberOfCardsPromises = lists.map(async (list: any) => {
      const numberOfCards = await getNumberOfCardsInList(list.id);
      return { [list.name]: numberOfCards };
    });

    const numberOfCardsResults = await Promise.all(numberOfCardsPromises);

    const numberOfCards = numberOfCardsResults.reduce(
      (acc: any, current: any) => ({ ...acc, ...current }),
      {}
    );

    const numberOfCardsForDaysLastWeek = await getNumberOfCardsCreatedLastWeek(boardId);

    const combinedStats = {
      inToDo: numberOfCards["inToDo"] || 0,
      inDone: numberOfCards["inDone"] || 0,
      inProgress: numberOfCards["inProgress"] || 0,
      tasksCreatedPerDayLastWeek: numberOfCardsForDaysLastWeek,
    };

    res.status(200).json({
      success: true,
      message: "Trello combined statistics retrieved successfully",
      data: combinedStats,
    });
  })
);

/**
 * Get number of cards per list (Protected)
 * GET /api/trello/cards/:boardId
 */
router.get(
  "/trello/cards/:boardId",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateParams(z.object({ boardId: z.string().min(1) })),
  asyncHandler(async (req: Request, res: Response) => {
    const boardId = req.params.boardId;

    if (!boardId) {
      throw new BadRequestError("Board ID is required");
    }

    const lists = await getListsForBoard(boardId);

    const numberOfCardsPromises = lists.map(async (list: any) => {
      const numberOfCards = await getNumberOfCardsInList(list.id);
      return { [list.name]: numberOfCards };
    });

    const numberOfCardsResults = await Promise.all(numberOfCardsPromises);

    const result = numberOfCardsResults.reduce(
      (acc: any, current: any) => ({ ...acc, ...current }),
      {}
    );

    res.status(200).json({
      success: true,
      message: "Trello cards per list retrieved successfully",
      data: result,
    });
  })
);

/**
 * Get number of cards created for each day of last week (Protected)
 * GET /api/trello/weekly-stats/:boardId
 */
router.get(
  "/trello/weekly-stats/:boardId",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateParams(z.object({ boardId: z.string().min(1) })),
  asyncHandler(async (req: Request, res: Response) => {
    const boardId = req.params.boardId;

    if (!boardId) {
      throw new BadRequestError("Board ID is required");
    }

    const numberOfCardsForDaysLastWeek = await getNumberOfCardsCreatedLastWeek(boardId);
    res.status(200).json({
      success: true,
      message: "Trello weekly statistics retrieved successfully",
      data: numberOfCardsForDaysLastWeek,
    });
  })
);

export default router;
