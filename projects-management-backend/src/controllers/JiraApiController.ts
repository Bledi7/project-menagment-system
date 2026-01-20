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

const JiraBaseUrl = process.env.JiraBaseUrl;
const Email = process.env.Email;
const Token = process.env.Token;

/**
 * Fetch task count for a specific JQL query
 */
async function fetchTaskCount(jql: string): Promise<number> {
  if (!JiraBaseUrl || !Email || !Token) {
    throw new BadRequestError("Jira configuration not set");
  }

  const url = `${JiraBaseUrl}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=0`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${Email}:${Token}`).toString("base64")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch task count for JQL: ${jql}`);
  }

  const data = (await response.json()) as any;
  return data.total;
}

/**
 * Fetch task data for a specific JQL query
 */
async function fetchTaskData(jql: string): Promise<any[]> {
  if (!JiraBaseUrl || !Email || !Token) {
    throw new BadRequestError("Jira configuration not set");
  }

  const url = `${JiraBaseUrl}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=1000`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${Email}:${Token}`).toString("base64")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch task data for JQL: ${jql}`);
  }

  const data = (await response.json()) as any;
  return data.issues || [];
}

/**
 * Get Jira statistics for a project (Protected)
 * GET /api/jira/statistics/:projectKey
 */
router.get(
  "/jira/statistics/:projectKey",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateParams(z.object({ projectKey: z.string().min(1) })),
  asyncHandler(async (req: Request, res: Response) => {
    const projectKey = req.params.projectKey;

    if (!projectKey) {
      throw new BadRequestError("Project key is required");
    }

    // Create JQL queries
    const queries = [
      {
        name: "inToDo",
        jql: `project=${projectKey} AND status = "To Do"`,
        type: "count",
      },
      {
        name: "inDone",
        jql: `project=${projectKey} AND status = "Done"`,
        type: "count",
      },
      {
        name: "inProgress",
        jql: `project=${projectKey} AND status = "In Progress"`,
        type: "count",
      },
      {
        name: "createdLastWeek",
        jql: `project=${projectKey} AND created >= -7d`,
        type: "data",
      },
      {
        name: "doneLastWeek",
        jql: `project=${projectKey} AND status changed to "Done" during (-7d, now())`,
        type: "count",
      },
      {
        name: "updatedLastWeek",
        jql: `project=${projectKey} AND updated >= -7d`,
        type: "count",
      },
      {
        name: "tasksCreatedPerDayLastWeek",
        jql: `project=${projectKey} AND created >= startOfWeek(-1) AND created <= endOfWeek(-1)`,
        type: "data",
      },
    ];

    // Fetch data for each query
    const results = await Promise.all(
      queries.map(async (query) => {
        try {
          if (query.type === "count") {
            const count = await fetchTaskCount(query.jql);
            return { name: query.name, count };
          } else {
            const data = await fetchTaskData(query.jql);
            if (query.name === "createdLastWeek") {
              return { name: query.name, count: data.length };
            } else if (query.name === "tasksCreatedPerDayLastWeek") {
              const tasksCreatedPerDay: { [key: string]: number } = {};
              const daysOfWeek = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];

              // Initialize with 0 counts for all days
              daysOfWeek.forEach((day) => {
                tasksCreatedPerDay[day] = 0;
              });

              data.forEach((task: any) => {
                const createdDate = new Date(task.fields.created).toLocaleDateString("en-US", {
                  weekday: "long",
                });
                tasksCreatedPerDay[createdDate] = (tasksCreatedPerDay[createdDate] || 0) + 1;
              });

              return { name: query.name, count: tasksCreatedPerDay };
            }
            return { name: query.name, count: data.length };
          }
        } catch (error: any) {
          console.error(`Error fetching ${query.name}:`, error.message);
          return { name: query.name, count: 0 };
        }
      })
    );

    // Aggregate the results into an object
    const statistics: { [key: string]: any } = {};
    results.forEach((result) => {
      statistics[result.name] = result.count;
    });

    res.status(200).json({
      success: true,
      message: "Jira statistics retrieved successfully",
      data: statistics,
    });
  })
);

/**
 * Get assignable users for a Jira project (Protected)
 * GET /api/jira/users/:projectKey
 */
router.get(
  "/jira/users/:projectKey",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateParams(z.object({ projectKey: z.string().min(1) })),
  asyncHandler(async (req: Request, res: Response) => {
    const projectKey = req.params.projectKey;

    if (!projectKey) {
      throw new BadRequestError("Project key is required");
    }

    if (!JiraBaseUrl || !Email || !Token) {
      throw new BadRequestError("Jira configuration not set");
    }

    const url = `${JiraBaseUrl}/rest/api/2/user/assignable/multiProjectSearch?projectKeys=${projectKey}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${Email}:${Token}`).toString("base64")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users for project ${projectKey}`);
    }

    const data = (await response.json()) as any;
    const users = (data.users || []).map((user: any) => ({
      id: user.accountId,
      name: user.displayName,
      emailAddress: user.emailAddress,
    }));

    res.status(200).json({
      success: true,
      message: "Jira users retrieved successfully",
      data: users,
    });
  })
);

export default router;
