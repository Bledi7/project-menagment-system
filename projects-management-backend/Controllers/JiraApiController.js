const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

const JiraBaseUrl = process.env.JiraBaseUrl;
const Email = process.env.Email;
const Token = process.env.Token;
const auth = require("./AuthController");

// Fetch task count for a specific JQL query
async function fetchTaskCount(jql) {
  try {
    const url = `${JiraBaseUrl}/rest/api/2/search?jql=${encodeURIComponent(
      jql
    )}&maxResults=0`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${Email}:${Token}`).toString(
          "base64"
        )}`,
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.total;
    } else {
      throw new Error(`Failed to fetch task count for JQL: ${jql}`);
    }
  } catch (error) {
    throw new Error(`Error occurred during task count fetch for JQL: ${jql}`);
  }
}

// Retrieve Jira statistics
router.get(
  "/statistics/:projectKey",
  // auth.authenticateUser,
  async (req, res) => {
    try {
      const projectKey = req.params.projectKey;

      // Create JQL queries
      const queries = [
        // Tasks in To Do
        {
          name: "inToDo",
          jql: `project=${projectKey} AND status = "To Do"`,
        },
        // Tasks in Done
        {
          name: "inDone",
          jql: `project=${projectKey} AND status = "Done"`,
        },
        // Tasks in Progress
        {
          name: "inProgress",
          jql: `project=${projectKey} AND status = "In Progress"`,
        },
        // Tasks created last week
        {
          name: "createdLastWeek",
          jql: `project=${projectKey} AND created >= -7d`,
        },
        // Tasks done last week
        {
          name: "doneLastWeek",
          jql: `project=${projectKey} AND status changed to "Done" during (-7d, now())`,
        },
        // Tasks updated last week
        {
          name: "updatedLastWeek",
          jql: `project=${projectKey} AND updated >= -7d`,
        },
        // Tasks created per day last week
        {
          name: "tasksCreatedPerDayLastWeek",
          jql: `project=${projectKey} AND created >= startOfWeek(-1) AND created <= endOfWeek(-1)`,
        },
      ];

      // Fetch data for each query
      const results = await Promise.all(
        queries.map(async (query) => {
          if (
            query.name === "createdLastWeek" ||
            query.name === "tasksCreatedPerDayLastWeek"
          ) {
            const data = await fetchTaskData(query.jql);
            if (query.name === "createdLastWeek") {
              return { name: query.name, count: data.length };
            } else if (query.name === "tasksCreatedPerDayLastWeek") {
              const tasksCreatedPerDay = {};
              const daysOfWeek = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];
              // Initialize tasksCreatedPerDay object with 0 counts for all days of the week
              daysOfWeek.forEach((day) => {
                tasksCreatedPerDay[day] = 0;
              });
              data.forEach((task) => {
                const createdDate = new Date(
                  task.fields.created
                ).toLocaleDateString("en-US", { weekday: "long" });
                tasksCreatedPerDay[createdDate] += 1;
              });
              return { name: query.name, count: tasksCreatedPerDay };
            }
          } else {
            const count = await fetchTaskCount(query.jql);
            return { name: query.name, count };
          }
        })
      );

      // Aggregate the results into an object
      const statistics = {};
      results.forEach((result) => {
        statistics[result.name] = result.count;
      });

      res.json(statistics);
    } catch (error) {
      console.error("Error occurred during Jira statistics fetch:", error);
      res
        .status(500)
        .json({ error: "Error occurred during Jira statistics fetch" });
    }
  }
);

// Fetch task data for a specific JQL query
async function fetchTaskData(jql) {
  try {
    const url = `${JiraBaseUrl}/rest/api/2/search?jql=${encodeURIComponent(
      jql
    )}&maxResults=1000`; // Increase maxResults to fetch all relevant tasks

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${Email}:${Token}`).toString(
          "base64"
        )}`,
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.issues;
    } else {
      throw new Error(`Failed to fetch task data for JQL: ${jql}`);
    }
  } catch (error) {
    throw new Error(`Error occurred during task data fetch for JQL: ${jql}`);
  }
}
// Add the following route to retrieve users of a project
router.get("/users/:projectKey", async (req, res) => {
  try {
    const projectKey = req.params.projectKey;
    const response = await fetch(
      `${JiraBaseUrl}/rest/api/2/user/assignable/multiProjectSearch?projectKeys=${projectKey}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(`${Email}:${Token}`).toString(
            "base64"
          )}`,
          Accept: "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const users = data.users.map((user) => ({
        id: user.accountId,
        name: user.displayName,
        emailAddress: user.emailAddress,
      }));
      res.json(users);
    } else {
      throw new Error(`Failed to fetch users for project ${projectKey}`);
    }
  } catch (error) {
    console.error("Error occurred during users fetch:", error);
    res.status(500).json({ error: "Error occurred during users fetch" });
  }
});

module.exports = router;
