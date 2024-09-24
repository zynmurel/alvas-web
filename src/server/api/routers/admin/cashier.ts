import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const cashierRouter = createTRPCRouter({
    getAllCashier: publicProcedure
      .query(({ ctx }) => {
          return ctx.db.cashier.findMany()
      }),
      getCashier : publicProcedure
      .input(z.object({
        id:z.number()
      }))
      .query(({ctx, input : {id}})=>{
        return ctx.db.cashier.findUnique({
            where: {
                id
            }
        })
      }),
      createCashier : publicProcedure
      .input(z.object({
        id : z.number().optional(),
        admin_id : z.number(),
        username : z.string().min(8, { message: "Username should be atleast 8 characters." }),
        first_name : z.string(),
        middle_name : z.string(),
        last_name : z.string(),
      }))
      .mutation(async({ctx, input : {
        id,
        admin_id,
        username,
        first_name,
        middle_name,
        last_name
      }})=>{
        const settings =await ctx.db.settings.findUnique({
            where : {
                admin_id:admin_id
            } 
        })
        if(!!settings){
            return ctx.db.cashier.upsert({
                where : {
                    id : id || 0
                },
                create : {
                    admin_id,
                    username,
                    first_name,
                    middle_name,
                    last_name,
                    password : settings.defaultPassForStaff
                },
                update : {
                    username,
                    first_name,
                    middle_name,
                    last_name
                }
            })
        }else {
            throw new Error("Setting not found.")
        }
      }),
      resetCashierPass: publicProcedure
        .input(z.object({
            id:z.number(),
            admin_id:z.number()
        }))
        .mutation(async({ ctx, input: { id, admin_id } }) => {
            const settings =await ctx.db.settings.findUnique({
                where : {
                    admin_id:admin_id
                } 
            })
            if(!!settings){
                return ctx.db.cashier.update({
                    where : {
                        id
                    },
                    data : {
                        password : settings.defaultPassForStaff
                    }
                })
            }else {
                throw new Error("Setting not found.")
            }
        })
});
