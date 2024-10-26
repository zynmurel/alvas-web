import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const customerTransactionRouter = createTRPCRouter({
  getCustomerTransactions: publicProcedure
    .input(z.object({
      customer_id: z.number()
    }))
    .query(async ({ ctx, input: { customer_id } }) => {
      return await ctx.db.transaction.findMany({
        where: {
          customer_id,
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
          customer : {
            include : {
              barangay : true
            }
          },
          grouped_delivery : true,
          rider: true
        }
      })
    }),
  cancelTransaction: publicProcedure
    .input(z.object({
      transaction_id: z.number()
    }))
    .mutation(async ({ ctx, input: { transaction_id } }) => {
      return ctx.db.transaction.update({
        where : {
          id:transaction_id,
          status:"PENDING"
        },
        data :{
          status:"CANCELLED"
        }
      })
    }),
});
