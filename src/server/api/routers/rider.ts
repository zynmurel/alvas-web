import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const riderRouter = createTRPCRouter({
  getAllRider: publicProcedure
    .query(({ ctx }) => {
        return ctx.db.delivery_rider.findMany()
    }),
    getRider : publicProcedure
    .input(z.object({
      id:z.number()
    }))
    .query(({ctx, input : {id}})=>{
      return ctx.db.delivery_rider.findUnique({
          where: {
              id
          }
      })
    }),
    createRider : publicProcedure
    .input(z.object({
      id : z.number().optional(),
      admin_id : z.number(),
      username : z.string().min(8, { message: "Username should be atleast 8 characters." }),
      first_name : z.string(),
      middle_name : z.string(),
      last_name : z.string(),
      contact_number : z.string(),
    }))
    .mutation(async({ctx, input : {
      id,
      admin_id,
      username,
      first_name,
      middle_name,
      last_name,
      contact_number
    }})=>{
      const settings =await ctx.db.settings.findUnique({
          where : {
              admin_id:admin_id
          } 
      })
      if(!!settings){
          return ctx.db.delivery_rider.upsert({
              where : {
                  id : id || 0
              },
              create : {
                  admin_id,
                  username,
                  first_name,
                  middle_name,
                  last_name,
                  contact_number,
                  password : settings.defaultPassForStaff
              },
              update : {
                  username,
                  first_name,
                  middle_name,
                  last_name,
                  contact_number
              }
          })
      }else {
          throw new Error("Setting not found.")
      }
    }),
    resetRiderPass: publicProcedure
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
              return ctx.db.delivery_rider.update({
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
