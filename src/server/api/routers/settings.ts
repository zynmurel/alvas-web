import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const settingsRouter = createTRPCRouter({
  getSettings: publicProcedure
    .input(z.object({ admin_id:z.number() }))
    .query(({ input, ctx }) => {
      return ctx.db.settings.findUnique({
        where:{
          admin_id : input.admin_id
        }
      })
    }),
    updateStoreName : publicProcedure
    .input(z.object({
      admin_id:z.number(),
      store_name:z.string(),
      extra_details:z.string(),
      address:z.string()
    }))
    .mutation(({ctx, input:{admin_id, store_name, extra_details, address}})=>{
      return ctx.db.settings.update({
        where : {
          admin_id
        },
        data:{
          store_name,
          extra_details,
          address
        }
      })
    }),
    updateContact : publicProcedure
    .input(z.object({
      admin_id:z.number(),
      contact_number:z.string(),
      email_address:z.string()
    }))
    .mutation(({ctx, input:{admin_id, contact_number ,email_address}})=>{
      return ctx.db.settings.update({
        where : {
          admin_id
        },
        data:{
          contact_number,
          email_address
        }
      })
    }),
    updateDeliveryFee : publicProcedure
    .input(z.object({
      admin_id:z.number(),
      delivery_fee:z.number(),
    }))
    .mutation(({ctx, input:{admin_id, delivery_fee}})=>{
      return ctx.db.settings.update({
        where : {
          admin_id
        },
        data:{
          delivery_fee,
        }
      })
    }),
    updateDefaultPassForStaff : publicProcedure
    .input(z.object({
      admin_id:z.number(),
      defaultPassForStaff:z.string(),
    }))
    .mutation(({ctx, input:{admin_id, defaultPassForStaff}})=>{
      return ctx.db.settings.update({
        where : {
          admin_id
        },
        data:{
          defaultPassForStaff,
        }
      })
    }),
});
