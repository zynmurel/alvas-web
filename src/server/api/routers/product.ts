import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
    getAllProducts: publicProcedure.input(z.object({
        status :z.enum(["AVAILABLE", "NOT_AVAILABLE", "ALL"]),
        category : z.enum(["ALL" , "CHICKEN" , "CHICHARON" , "RICE" , "DRINKS"])
    })).query(({ input, ctx }) => {
        const whereStatus = input.status === "ALL" ? {} : {status:input.status}
        const whereCategorty = input.category === "ALL" ? {} : {category:input.category}
        return ctx.db.products.findMany({
            where : {
                ...whereStatus,
                ...whereCategorty
            }
        })
    }),
    upsertProduct: publicProcedure
        .input(z.object({
            id: z.number().nullish(),
            image_url: z.string(),
            product_name: z.string(),
            category: z.enum(["CHICKEN", "CHICHARON", "RICE", "DRINKS"]),
            amount: z.coerce.number(),
            admin_id: z.number()
        }))
        .mutation(({ input, ctx }) => {
            return ctx.db.products.upsert({
                where: {
                    id: input.id || 0
                },
                create: {
                    image_url: input.image_url,
                    product_name: input.product_name,
                    category: input.category,
                    amount: input.amount,
                    admin_id: input.admin_id
                },
                update: {
                    image_url: input.image_url,
                    product_name: input.product_name,
                    category: input.category,
                    amount: input.amount,
                }
            })
        }),
})