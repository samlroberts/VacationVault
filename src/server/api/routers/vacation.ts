import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const vacationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        destination: z.string().min(1),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.vacation.create({
        data: {
          name: input.name,
          destination: input.destination,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          description: input.description,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        destination: z.string().min(1).optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Convert dates if they exist
      const parsedData = {
        ...updateData,
        ...(updateData.startDate && {
          startDate: new Date(updateData.startDate),
        }),
        ...(updateData.endDate && { endDate: new Date(updateData.endDate) }),
      };

      return ctx.db.vacation.update({
        where: {
          id: id,
          userId: ctx.session.user.id, // Ensure user owns the vacation
        },
        data: parsedData,
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.vacation.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id, // Ensure user owns the vacation
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.vacation.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        startDate: "desc",
      },
    });
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.vacation.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  // addPhotos: protectedProcedure
  //   .input(z.object({ vacationId: z.string(), photos: z.array(z.string()) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.vacation.update({
  //       where: { id: input.vacationId },
  //       data: { photos: { set: input.photos.map((url) => ({ url })) } },
  //     });
  //   }),
});
