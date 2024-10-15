import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const riderDeliveryRouter = createTRPCRouter({
    getTransactionsForDelivery : publicProcedure
    .input(z.object({
        id:z.number(),
    }))
    .query( async ({ctx, input : {id}})=>{
        return await ctx.db.transaction.findMany({
            where : {
                delivery_rider_id : id,
                status : "ONGOING"
            },
            include : {
                orders : {
                    include : {
                        product : true
                    }
                },
                customer : true
            },
            orderBy : {
                createdAt : "desc"
            }
        })
    }),    
    getTransactionsDelivered : publicProcedure
    .input(z.object({
        id:z.number(),
    }))
    .query( async ({ctx, input : {id}})=>{
        return await ctx.db.transaction.findMany({
            where : {
                delivery_rider_id : id,
                status : "DELIVERED"
            },
            include : {
                orders : {
                    include : {
                        product : true
                    }
                },
                customer : true
            },
            orderBy : {
                createdAt : "desc"
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
            status:"ONGOING"
          },
          data :{
            status:"CANCELLED"
          }
        })
      }),
      transactionDelivered: publicProcedure
        .input(z.object({
          transaction_id: z.number()
        }))
        .mutation(async ({ ctx, input: { transaction_id } }) => {
          return ctx.db.transaction.update({
            where : {
              id:transaction_id,
              status:"ONGOING"
            },
            data :{
              status:"DELIVERED"
            }
          })
        }),
});
