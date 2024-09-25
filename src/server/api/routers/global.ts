import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const globalRouter = createTRPCRouter({
  getSettings: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.settings.findFirst()
    }),

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //       },
  //     });
  //   }),

  // getLatest: publicProcedure.query(async ({ ctx }) => {
  //   const post = await ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //   });

  //   return post ?? null;
  // }),
});
