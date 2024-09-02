import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
export const categoryRouter = createTRPCRouter({
    getCategories : publicProcedure.query(({ctx})=>{
        return ctx.db.product_category.findMany({
            include:{
                products:true
            }
        })
    }),
    upsertCategory : publicProcedure.input(z.object({
        category_name:z.string(),
        id:z.number()
    })).mutation(({ctx, input})=>{
        return ctx.db.product_category.upsert({
            where : {
                id: input.id
            },
            create:{
                category_name:input.category_name
            },
            update:{
                category_name:input.category_name
            }
        })
    }),
    deleteCategory : publicProcedure.input(z.object({
        id:z.number()
    })).mutation(({ctx, input})=>{
        return ctx.db.product_category.delete({
            where : {
                id: input.id
            },
        })
    })
})