import { Router, Request, Response } from "express";
import { db } from "@db/index";
import { teams, teamLeads, teamMembers } from "@db/schema/teams";
import { users } from "@db/schema/users";
import { projects } from "@db/schema/projects";
import { eq, and, inArray } from "drizzle-orm";
import { asyncHandler } from "@utils/errorHandler";
import { NotFoundError, BadRequestError } from "@utils/errors";
import { authenticateJWT, restrictTo } from "@middleware/auth";
import { validateRequest, validateParams, validateQuery } from "@middleware/validation";
import { z } from "zod";
import { createTeamDtoSchema, updateTeamDtoSchema, type CreateTeamDto, type UpdateTeamDto } from "@dto/team.dto";

const teamRoute = Router();

/**
 * Create a new team (Protected - Scrum Master, Product Owner, Admin)
 * POST /api/teams
 */
teamRoute.post(
  "/teams",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateRequest(createTeamDtoSchema),
  asyncHandler(async (req: Request<{}, {}, CreateTeamDto>, res: Response) => {
    const { title, projectId, leadIds, memberIds } = req.body;

    // Verify project exists if provided
    if (projectId) {
      const projectResults = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (projectResults.length === 0) {
        throw new NotFoundError("Project not found");
      }
    }

    // Verify all users exist
    const allUserIds = [
      ...(leadIds || []),
      ...(memberIds || []),
    ];

    if (allUserIds.length > 0) {
      const uniqueUserIds = [...new Set(allUserIds)];
      const userResults = await db
        .select()
        .from(users)
        .where(inArray(users.id, uniqueUserIds));

      if (userResults.length !== uniqueUserIds.length) {
        throw new NotFoundError("One or more users not found");
      }
    }

    const newTeam = await db.transaction(async (tx) => {
      // Create team
      const [team] = await tx
        .insert(teams)
        .values({
          title,
          projectId: projectId || null,
        })
        .returning();

      // Add team leads if provided
      if (leadIds && Array.isArray(leadIds) && leadIds.length > 0) {
        await tx.insert(teamLeads).values(
          leadIds.map((userId: number) => ({
            teamId: team.id,
            userId,
          }))
        );
      }

      // Add team members if provided
      if (memberIds && Array.isArray(memberIds) && memberIds.length > 0) {
        await tx.insert(teamMembers).values(
          memberIds.map((userId: number) => ({
            teamId: team.id,
            userId,
          }))
        );
      }

      return team;
    });

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: newTeam,
    });
  })
);

/**
 * Get all teams (Protected)
 * GET /api/teams
 */
teamRoute.get(
  "/teams",
  authenticateJWT,
  validateQuery(
    z.object({
      projectId: z.string().regex(/^\d+$/).transform(Number).optional(),
      leadId: z.string().regex(/^\d+$/).transform(Number).optional(),
      employeeId: z.string().regex(/^\d+$/).transform(Number).optional(),
    })
  ),
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
    const leadId = req.query.leadId ? parseInt(req.query.leadId as string) : undefined;
    const employeeId = req.query.employeeId ? parseInt(req.query.employeeId as string) : undefined;

    let teamIds: number[] | undefined;

    // Filter by lead or employee
    if (leadId) {
      const teamLeadResults = await db
        .select({ teamId: teamLeads.teamId })
        .from(teamLeads)
        .where(eq(teamLeads.userId, leadId));

      teamIds = teamLeadResults.map((t) => t.teamId);
      if (teamIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Teams retrieved successfully",
          data: [],
        });
      }
    } else if (employeeId) {
      const teamMemberResults = await db
        .select({ teamId: teamMembers.teamId })
        .from(teamMembers)
        .where(eq(teamMembers.userId, employeeId));

      teamIds = teamMemberResults.map((t) => t.teamId);
      if (teamIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Teams retrieved successfully",
          data: [],
        });
      }
    }

    // Get teams
    let query = db.select().from(teams);
    if (projectId) {
      query = query.where(eq(teams.projectId, projectId)) as any;
    } else if (teamIds && teamIds.length > 0) {
      query = query.where(inArray(teams.id, teamIds)) as any;
    }

    const teamsList = await query;

    // Populate leads and members for each team
    const populatedTeams = await Promise.all(
      teamsList.map(async (team) => {
        const [leadsData, membersData, projectData] = await Promise.all([
          db
            .select({ user: users })
            .from(teamLeads)
            .innerJoin(users, eq(teamLeads.userId, users.id))
            .where(eq(teamLeads.teamId, team.id)),
          db
            .select({ user: users })
            .from(teamMembers)
            .innerJoin(users, eq(teamMembers.userId, users.id))
            .where(eq(teamMembers.teamId, team.id)),
          team.projectId
            ? db
                .select()
                .from(projects)
                .where(eq(projects.id, team.projectId))
                .limit(1)
            : Promise.resolve([]),
        ]);

        const leads = leadsData.map((d) => {
          const { password, ...user } = d.user;
          return user;
        });
        const employees = membersData.map((d) => {
          const { password, ...user } = d.user;
          return user;
        });

        return {
          ...team,
          leads,
          employees,
          project: projectData[0] || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Teams retrieved successfully",
      data: populatedTeams,
    });
  })
);

/**
 * Get teams grouped by project (Protected)
 * GET /api/teams/by-project
 */
teamRoute.get(
  "/teams/by-project",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const teamsWithProjects = await db
      .select({
        team: teams,
        project: projects,
      })
      .from(teams)
      .leftJoin(projects, eq(teams.projectId, projects.id));

    const grouped = new Map<number | string, { project: typeof projects.$inferSelect | null; teams: string[] }>();

    for (const row of teamsWithProjects) {
      const projectId = row.project?.id || "no-project";

      if (!grouped.has(projectId)) {
        grouped.set(projectId, {
          project: row.project || null,
          teams: [],
        });
      }

      grouped.get(projectId)!.teams.push(row.team.title);
    }

    const result = Array.from(grouped.values());

    res.status(200).json({
      success: true,
      message: "Teams grouped by project retrieved successfully",
      data: result,
    });
  })
);

/**
 * Get team by ID (Protected)
 * GET /api/teams/:id
 */
teamRoute.get(
  "/teams/:id",
  authenticateJWT,
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const teamId = parseInt(req.params.id);

    if (isNaN(teamId)) {
      throw new BadRequestError("Invalid team ID");
    }

    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!team) {
      throw new NotFoundError("Team not found");
    }

    // Populate leads, members, and project
    const [leadsData, membersData, projectData] = await Promise.all([
      db
        .select({ user: users })
        .from(teamLeads)
        .innerJoin(users, eq(teamLeads.userId, users.id))
        .where(eq(teamLeads.teamId, teamId)),
      db
        .select({ user: users })
        .from(teamMembers)
        .innerJoin(users, eq(teamMembers.userId, users.id))
        .where(eq(teamMembers.teamId, teamId)),
      team.projectId
        ? db
            .select()
            .from(projects)
            .where(eq(projects.id, team.projectId))
            .limit(1)
        : Promise.resolve([]),
    ]);

    const leads = leadsData.map((d) => {
      const { password, ...user } = d.user;
      return user;
    });
    const employees = membersData.map((d) => {
      const { password, ...user } = d.user;
      return user;
    });

    res.status(200).json({
      success: true,
      message: "Team retrieved successfully",
      data: {
        ...team,
        leads,
        employees,
        project: projectData[0] || null,
      },
    });
  })
);

/**
 * Update team (Protected - Scrum Master, Product Owner, Admin)
 * PUT /api/teams/:id
 */
teamRoute.put(
  "/teams/:id",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  validateRequest(updateTeamDtoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const teamId = parseInt(req.params.id);

    if (isNaN(teamId)) {
      throw new BadRequestError("Invalid team ID");
    }

    const { title, projectId, leadIds, memberIds } = req.body as UpdateTeamDto;

    // Verify project exists if being changed
    if (projectId !== undefined && projectId !== null) {
      const projectResults = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (projectResults.length === 0) {
        throw new NotFoundError("Project not found");
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (projectId !== undefined) updateData.projectId = projectId;

    const [updatedTeam] = await db
      .update(teams)
      .set(updateData)
      .where(eq(teams.id, teamId))
      .returning();

    if (!updatedTeam) {
      throw new NotFoundError("Team not found");
    }

    // Update leads and members if provided
    if (leadIds !== undefined || memberIds !== undefined) {
      await db.transaction(async (tx) => {
        if (leadIds !== undefined) {
          // Delete existing leads
          await tx.delete(teamLeads).where(eq(teamLeads.teamId, teamId));

          // Insert new leads
          if (Array.isArray(leadIds) && leadIds.length > 0) {
            await tx.insert(teamLeads).values(
              leadIds.map((userId: number) => ({
                teamId,
                userId,
              }))
            );
          }
        }

        if (memberIds !== undefined) {
          // Delete existing members
          await tx.delete(teamMembers).where(eq(teamMembers.teamId, teamId));

          // Insert new members
          if (Array.isArray(memberIds) && memberIds.length > 0) {
            await tx.insert(teamMembers).values(
              memberIds.map((userId: number) => ({
                teamId,
                userId,
              }))
            );
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: updatedTeam,
    });
  })
);

/**
 * Delete team (Protected - Scrum Master, Product Owner, Admin)
 * DELETE /api/teams/:id
 */
teamRoute.delete(
  "/teams/:id",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateParams(z.object({ id: z.string().regex(/^\d+$/).transform(Number) })),
  asyncHandler(async (req: Request, res: Response) => {
    const teamId = parseInt(req.params.id);

    if (isNaN(teamId)) {
      throw new BadRequestError("Invalid team ID");
    }

    const [deletedTeam] = await db
      .delete(teams)
      .where(eq(teams.id, teamId))
      .returning();

    if (!deletedTeam) {
      throw new NotFoundError("Team not found");
    }

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
      data: deletedTeam,
    });
  })
);

export default teamRoute;
