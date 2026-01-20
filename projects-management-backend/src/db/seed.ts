/**
 * Seed script to populate database with initial data
 */
import { db } from "./index";
import { users, userRoleEnum, userStatusEnum } from "./schema/users";
import { projects } from "./schema/projects";
import { teams, teamLeads, teamMembers } from "./schema/teams";
import { sprints } from "./schema/sprints";
import { reports } from "./schema/reports";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

/**
 * Seed initial data
 */
async function seed() {
  try {
    console.log("Starting database seeding...");

    // Seed Users
    console.log("Seeding users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const [adminUser, productOwnerUser, scrumMasterUser, developerUser] = await db
      .insert(users)
      .values([
        {
          firstName: "Admin",
          lastName: "User",
          email: "admin@example.com",
          password: hashedPassword,
          role: "Admin",
          status: "approved",
          phoneNumber: "+1234567890",
        },
        {
          firstName: "Product",
          lastName: "Owner",
          email: "productowner@example.com",
          password: hashedPassword,
          role: "Product Owner",
          status: "approved",
          phoneNumber: "+1234567891",
        },
        {
          firstName: "Scrum",
          lastName: "Master",
          email: "scrummaster@example.com",
          password: hashedPassword,
          role: "Scrum Master",
          status: "approved",
          phoneNumber: "+1234567892",
        },
        {
          firstName: "Developer",
          lastName: "One",
          email: "developer@example.com",
          password: hashedPassword,
          role: "Developer",
          status: "approved",
          phoneNumber: "+1234567893",
        },
      ])
      .returning();

    console.log(`✓ Created ${adminUser.id + 3} users`);

    // Seed Projects
    console.log("Seeding projects...");
    const [project1, project2] = await db
      .insert(projects)
      .values([
        {
          title: "E-commerce Platform",
          status: "active",
          startDate: new Date("2024-01-01"),
          key: "ECOMM",
          isJiraProject: "true",
        },
        {
          title: "Mobile App Development",
          status: "active",
          startDate: new Date("2024-02-01"),
          key: "MOBILE",
          isJiraProject: "false",
        },
      ])
      .returning();

    console.log(`✓ Created ${project1.id + 1} projects`);

    // Seed Teams
    console.log("Seeding teams...");
    const [team1, team2] = await db
      .insert(teams)
      .values([
        {
          title: "Frontend Team",
          projectId: project1.id,
        },
        {
          title: "Backend Team",
          projectId: project1.id,
        },
      ])
      .returning();

    console.log(`✓ Created ${team1.id + 1} teams`);

    // Seed Team Leads
    console.log("Seeding team leads...");
    await db.insert(teamLeads).values([
      { teamId: team1.id, userId: scrumMasterUser.id },
      { teamId: team2.id, userId: productOwnerUser.id },
    ]);

    console.log("✓ Created team leads");

    // Seed Team Members
    console.log("Seeding team members...");
    await db.insert(teamMembers).values([
      { teamId: team1.id, userId: developerUser.id },
      { teamId: team2.id, userId: developerUser.id },
    ]);

    console.log("✓ Created team members");

    // Seed Sprints
    console.log("Seeding sprints...");
    const [sprint1, sprint2] = await db
      .insert(sprints)
      .values([
        { title: "Sprint 1 - Foundation" },
        { title: "Sprint 2 - Core Features" },
      ])
      .returning();

    console.log(`✓ Created ${sprint1.id + 1} sprints`);

    // Seed Reports
    console.log("Seeding reports...");
    await db.insert(reports).values([
      {
        userName: `${developerUser.firstName} ${developerUser.lastName}`,
        userId: developerUser.id,
        date: new Date(),
        report: "Completed user authentication module. Started working on dashboard.",
        isFavorite: false,
        isRead: false,
      },
      {
        userName: `${scrumMasterUser.firstName} ${scrumMasterUser.lastName}`,
        userId: scrumMasterUser.id,
        date: new Date(),
        report: "Conducted daily standup. Team is on track for sprint goals.",
        isFavorite: true,
        isRead: false,
      },
    ]);

    console.log("✓ Created reports");

    console.log("\n✓ Database seeding completed successfully!");
    console.log("\nSample credentials:");
    console.log("Admin: admin@example.com / password123");
    console.log("Product Owner: productowner@example.com / password123");
    console.log("Scrum Master: scrummaster@example.com / password123");
    console.log("Developer: developer@example.com / password123");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

/**
 * Clear all seed data (useful for testing)
 */
async function clearSeedData() {
  try {
    console.log("Clearing seed data...");

    // Delete in reverse order of dependencies
    await db.delete(teamMembers);
    await db.delete(teamLeads);
    await db.delete(teams);
    await db.delete(reports);
    await db.delete(sprints);
    await db.delete(projects);
    await db.delete(users);

    console.log("✓ Seed data cleared");
  } catch (error) {
    console.error("Error clearing seed data:", error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes("--clear")) {
    clearSeedData()
      .then(() => {
        console.log("Done!");
        process.exit(0);
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  } else {
    seed()
      .then(() => {
        console.log("Done!");
        process.exit(0);
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  }
}

export { seed, clearSeedData };
