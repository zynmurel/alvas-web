import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { endOfDay, startOfDay } from "date-fns";

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
      profile_image:z.string()
    }))
    .mutation(async({ctx, input : {
      id,
      admin_id,
      username,
      first_name,
      middle_name,
      last_name,
      contact_number,
      profile_image
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
                  password : settings.defaultPassForStaff,
                  profile_image
              },
              update : {
                  username,
                  first_name,
                  middle_name,
                  last_name,
                  contact_number,
                  profile_image
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
      }),
      getRiderForSelect  : publicProcedure
      .query(async({ctx})=>{
        return await ctx.db.delivery_rider.findMany({
            select:{
                id:true,
                first_name:true,
                middle_name:true,
                last_name:true,
                _count:{
                    select:{
                        grouped_delivery: {
                            where:{
                                createdAt:{
                                    gte:startOfDay(new Date()),
                                    lte:endOfDay(new Date())
                                }
                            },
                        }
                    }
                },
                grouped_delivery:{
                    where:{
                        status:"ONGOING"
                    },
                    select:{
                        transactions:{
                            select:{
                                customer:{
                                    select:{
                                        barangay:true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        .then((data)=>{
            return data.map((rider)=>{
                const name = `${rider.first_name} ${rider.middle_name} ${rider.last_name}`
                const barangay = rider.grouped_delivery[0]?.transactions[0]?.customer?.barangay.barangay_name||""
                return ({
                label : name,
                value : rider.id,
                barangay,
                isOngoing:rider.grouped_delivery.length>0,
                deliveryCount:rider._count.grouped_delivery
            })}).sort((a, b)=>{
                const toNumber = (data:boolean )=>data?1:0
                return toNumber(a.isOngoing) - toNumber(b.isOngoing)
            })
        })
      }),
});
