import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const photoRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        caption: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.db.photo.findUnique({
        where: { id: input.id },
      });

      if (!photo || photo.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.photo.update({
        where: { id: input.id },
        data: {
          caption: input.caption,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.db.photo.findUnique({
        where: { id: input.id },
      });

      if (!photo || photo.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.photo.delete({
        where: { id: input.id },
      });
    }),
});
