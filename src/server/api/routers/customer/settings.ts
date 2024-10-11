import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const customerSettingsRouter = createTRPCRouter({
    getSettings: publicProcedure
      .query(async ({ctx}) => {
        return await ctx.db.settings.findFirst()
      }),
});
