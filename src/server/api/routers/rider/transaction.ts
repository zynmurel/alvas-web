import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const riderTransactionRouter = createTRPCRouter({
  getRiderTransactions: publicProcedure
    .input(z.object({
      delivery_rider_id: z.number()
    }))
    .query(async ({ ctx, input: { delivery_rider_id } }) => {
      return await ctx.db.transaction.findMany({
        where: {
          delivery_rider_id,
        },
        orderBy: {
          createdAt: "desc"
        },
        include: {
          orders: {
            include: {
              product: true
            }
          },
          rider: true
        }
      })
    }),
});
