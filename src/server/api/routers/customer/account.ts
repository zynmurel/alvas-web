import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const customerAccountRouter = createTRPCRouter({
    getAccountDetails : publicProcedure
    .input(z.object({
        id:z.number(),
    }))
    .query( async ({ctx, input : {id}})=>{
        return await ctx.db.customer.findUnique({
            where : {
                id
            }
        })
    }),
    getBarangays : publicProcedure
    .query( async ({ctx})=>{
        return await ctx.db.barangays.findMany({
            orderBy : {
                barangay_name : 'asc'
            }
        }).then((data)=>(
            data.map((brgy=>({
                value:brgy.id,
                label:brgy.barangay_name,
                delivery_fee:brgy.barangay_delivery_fee,
            })))
        ))
    }),
    updateCustomerInformation: publicProcedure
    .input(z.object({
        id:z.number(),
        first_name: z.string(),
        middle_name: z.string(),
        last_name: z.string(),
        contact_number: z.string(),
        address: z.string(),
        place_description: z.string(),
        barangayId: z.number(),
    }))
    .mutation( async ({ctx, input : {
        id,
        first_name,
        middle_name,
        last_name,
        contact_number,
        address,
        place_description,
        barangayId
    }})=>{
        return await ctx.db.customer.update({
            where : {
                id
            },
            data : {
                first_name,
                middle_name,
                last_name,
                contact_number,
                address,
                place_description,
                barangayId
            }
        })
    }),
    updateCustomerUsername: publicProcedure
    .input(z.object({
        id:z.number(),
        username: z.string(),
    }))
    .mutation( async ({ctx, input : {
        id,
        username,
    }})=>{
        return await ctx.db.customer.update({
            where : {
                id
            },
            data : {
                username,
            }
        })
    }),
    updateCustomerPassword: publicProcedure
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
        return await ctx.db.customer.update({
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
