import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const cashierAccountRouter = createTRPCRouter({
    getAccountDetails : publicProcedure
    .input(z.object({
        id:z.number(),
    }))
    .query( async ({ctx, input : {id}})=>{
        return await ctx.db.cashier.findUnique({
            where : {
                id
            }
        })
    }),
    updateUsername : publicProcedure
    .input(z.object({
        id:z.number(),
        username: z.string()
    }))
    .mutation( async ({ctx, input : {
        id, username
    } })=>{
        return await ctx.db.cashier.update({
            where : {
                id
            },
            data : {
                username
            }
        })
    }),
    updateCashierPass : publicProcedure
    .input(z.object({
        id:z.number(),
        password : z.string(),
        newPassword : z.string()
    }))
    .mutation( async ({ctx, input : {
        id, password, newPassword
    } })=>{
        const account = await ctx.db.cashier.findUnique({
            where : {
                id,
                password
            }
        })
        if(!account){
            throw new Error("Incorrect Password")
        } else {
            return await ctx.db.cashier.update({
                where : {
                    id
                },
                data : {
                    password : newPassword
                }
            })
        }
    }),
    updateCashierDetails : publicProcedure
    .input(z.object({
        id:z.number(),
        first_name : z.string(),
        middle_name : z.string(),
        last_name : z.string(),
    }))
    .mutation( async ({ctx, input : {
        id, first_name, middle_name, last_name
    } })=>{
        const account = await ctx.db.cashier.update({
            where : {
                id,
            },
            data : {
                first_name, middle_name, last_name,
            }
        })
        return account
    }),
});
