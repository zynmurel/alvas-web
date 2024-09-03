import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
    getAllProducts: publicProcedure.input(z.object({
        status :z.enum(["AVAILABLE", "NOT_AVAILABLE", "ALL"]),
        category_id : z.number().optional()
    })).query(({ input, ctx }) => {
        const whereStatus = input.status === "ALL" ? {} : {status:input.status}
        const whereCategorty = !input.category_id ? {} : {category_id:input.category_id}
        return ctx.db.products.findMany({
            where : {
                ...whereStatus,
                ...whereCategorty,
            },
            include:{
                category:true,
                orders:true,
            }
        })
    }),
    getProduct :publicProcedure.input(z.object({
        id:z.number().optional()
    })).query(({ctx, input})=>{
        return ctx.db.products.findUnique({
            where:{
                id:input.id
            }
        })
    }),
    deleteProduct : publicProcedure.input(z.object({
        id:z.number()
    })).mutation(({ctx, input})=>{
        return ctx.db.products.delete({
            where:{
                id:input.id
            }
        })
    }),
    upsertProduct: publicProcedure
        .input(z.object({
            id: z.number().nullish(),
            image_url: z.string(),
            product_name: z.string(),
            category_id: z.number(),
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
                    category_id: input.category_id,
                    amount: input.amount,
                    admin_id: input.admin_id
                },
                update: {
                    image_url: input.image_url,
                    product_name: input.product_name,
                    category_id: input.category_id,
                    amount: input.amount,
                }
            })
        }),
})