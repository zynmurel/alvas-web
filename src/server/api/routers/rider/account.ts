import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const riderAccountRouter = createTRPCRouter({
    getAccountDetails : publicProcedure
    .input(z.object({
        id:z.number(),
    }))
    .query( async ({ctx, input : {id}})=>{
        return await ctx.db.delivery_rider.findUnique({
            where : {
                id
            }
        })
    }),
    updateRiderInformation: publicProcedure
    .input(z.object({
        id:z.number(),
        first_name: z.string(),
        middle_name: z.string(),
        last_name: z.string(),
        contact_number: z.string(),
    }))
    .mutation( async ({ctx, input : {
        id,
        first_name,
        middle_name,
        last_name,
        contact_number,
    }})=>{
        return await ctx.db.delivery_rider.update({
            where : {
                id
            },
            data : {
                first_name,
                middle_name,
                last_name,
                contact_number,
            }
        })
    }),
    updateRiderUsername: publicProcedure
    .input(z.object({
        id:z.number(),
        username: z.string(),
    }))
    .mutation( async ({ctx, input : {
        id,
        username,
    }})=>{
        return await ctx.db.delivery_rider.update({
            where : {
                id
            },
            data : {
                username,
            }
        })
    }),
    updateRiderPassword: publicProcedure
    .input(z.object({
        id:z.number(),
        password: z.string(),
        newPassword: z.string(),
    }))
    .mutation( async ({ctx, input : {
        id,
        password,
        newPassword,
    }})=>{
        return await ctx.db.delivery_rider.update({
            where : {
                id,
                password
            },
            data : {
                password:newPassword,
            }
        })
    }),
});
