import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const salesRouter = createTRPCRouter({
  getSales: publicProcedure
  .input(z.object({
    from:z.date(),
    to:z.date(),
  }))
  .query(({ ctx }) => {
    return ctx.db.transaction.findMany({
        where : {
          status : "DONE"
        },
        include : {
          orders : {
            include : {
              product : {
                include : {
                  category : true
                }
              }
            }
          }
        }
    })
}),
});
