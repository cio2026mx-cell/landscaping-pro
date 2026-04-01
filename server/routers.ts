import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getUserProjects, getProjectById, getAllInventory, getInventoryByCategory, getProjectElements, getTerrainAnalysisByProject, getMaterialEstimatesByProject, getDb } from "./db";
import { projects, projectElements, inventory, materialEstimates, terrainAnalysis } from "../drizzle/schema";
import { analyzeTerrainWithWavespeed, getPlantRecommendations } from "./wavespeed";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  projects: router({
    list: protectedProcedure.query(({ ctx }) => getUserProjects(ctx.user.id)),

    getById: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input, ctx }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or access denied");
        }
        return project;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(projects).values({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          status: "draft",
        });

        return result;
      }),

    update: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["draft", "in_progress", "completed", "archived"]).optional(),
        totalArea: z.string().optional(),
        estimatedCost: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or access denied");
        }

        const updateData: any = {};
        if (input.name) updateData.name = input.name;
        if (input.description) updateData.description = input.description;
        if (input.status) updateData.status = input.status;
        if (input.totalArea) updateData.totalArea = input.totalArea;
        if (input.estimatedCost) updateData.estimatedCost = input.estimatedCost;

        return db.update(projects).set(updateData).where(eq(projects.id, input.projectId));
      }),
  }),

  inventory: router({
    list: publicProcedure.query(() => getAllInventory()),

    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(({ input }) => getInventoryByCategory(input.category)),
  }),

  projectElements: router({
    getByProject: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input, ctx }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or access denied");
        }
        return getProjectElements(input.projectId);
      }),

    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        inventoryId: z.number(),
        quantity: z.number().default(1),
        positionX: z.string(),
        positionY: z.string(),
        rotation: z.string().optional(),
        scale: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or access denied");
        }

        return db.insert(projectElements).values({
          projectId: input.projectId,
          inventoryId: input.inventoryId,
          quantity: input.quantity,
          positionX: input.positionX,
          positionY: input.positionY,
          rotation: input.rotation || "0",
          scale: input.scale || "1",
        });
      }),

    delete: protectedProcedure
      .input(z.object({ elementId: z.number(), projectId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or access denied");
        }

        return db.delete(projectElements).where(eq(projectElements.id, input.elementId));
      }),
  }),

  terrainAnalysis: router({
    getByProject: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input, ctx }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or access denied");
        }
        return getTerrainAnalysisByProject(input.projectId);
      }),
  }),

  materialEstimates: router({
    getByProject: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input, ctx }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or access denied");
        }
        return getMaterialEstimatesByProject(input.projectId);
      }),
  }),

  wavespeed: router({
    analyzeTerrain: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        latitude: z.number(),
        longitude: z.number(),
        areaSize: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or access denied");
        }

        // TODO: Call actual Wavespeed API
        // For now, return mock data
        return {
          soilType: "Loamy soil",
          drainage: "good",
          sunExposure: "6-8 hours",
          slope: "5 degrees",
          confidence: 0.85,
        };
      }),

    getPlantRecommendations: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        sunExposure: z.string(),
        soilType: z.string(),
      }))
      .query(async ({ input, ctx }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or access denied");
        }

        // TODO: Integrate with Wavespeed recommendations
        return [
          {
            name: "Coneflower",
            type: "perennial",
            reason: "Thrives in well-drained soil",
          },
          {
            name: "Black-eyed Susan",
            type: "perennial",
            reason: "Excellent drainage tolerance",
          },
        ];
      }),
  }),
});

export type AppRouter = typeof appRouter;
