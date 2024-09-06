import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const transactionRouter = createTRPCRouter({
  getAdminOrders: publicProcedure
  .input(z.object({
    status : z.enum(["PENDING","ONGOING","DONE","CANCELLED"])
  }))
    .query(({ ctx, input : { status } }) => {
      return ctx.db.transaction.findMany({
        where :{
            status,
            transaction_type : "DELIVERY"
        },
        include : {
            orders:true,
            customer:true
        }
      }).then((transactions)=>(
        transactions.map((transaction)=>({
            id : transaction.id,
            customer_name : `${transaction.customer.first_name} ${transaction.customer.middle_name[0]}. ${transaction.customer.last_name}`,
            customer_contact : transaction.customer.contact_number,
            sub_total: transaction.total_amount,
            delivery_fee: transaction.delivery_fee || 0,
            total_amount : (transaction.delivery_fee || 0) + transaction.total_amount
        }))
      ))
    }),
    getAdminOrder :publicProcedure
    .input(z.object({
      id:z.number(),
    }))
    .query(({ ctx, input:{
      id
    } }) => {
      return ctx.db.transaction.findUnique({
        where :{
          id,
        },
        include : {
          orders:{
            include : {
              product : true
            }
          },
          customer:true,
          rider : true
        }
      }).then((transaction)=>{
        if(transaction){
          return {
            status : transaction.status,
            order_date : transaction.createdAt,
            order_details : {
              orders : transaction.orders.map(order=>({
                product_name : order.product.product_name,
                quantity : order.quantity,
                price : order.product.amount
              })),
              sub_total : transaction.total_amount,
              delivery_fee : transaction.delivery_fee || 0
            },
            customer_info : {
              name :`${transaction.customer.first_name} ${transaction.customer.middle_name[0]}. ${transaction.customer.last_name}`,
              contact_number : transaction.customer.contact_number
            },
            delivery_info :transaction.rider ? {
              name : `${transaction.rider.first_name} ${transaction.rider.middle_name[0]}. ${transaction.rider.last_name}`,
              contact_number : transaction.rider.contact_number
            } : null
          }
        }else{
          throw new Error("Transaction not found")
        }
      })
    }),
    assignRiderToTransaction :publicProcedure
    .input(z.object({
      transaction_id:z.number(),
      rider_id:z.number(),
    }))
    .mutation(({ ctx, input:{
      transaction_id,
      rider_id
    } })=>{
      return ctx.db.transaction.update({
        where : {
          id:transaction_id
        },
        data : {
          delivery_rider_id : rider_id,
          status : "ONGOING"
        }
      })
    }),
    cancelTransaction :publicProcedure
    .input(z.object({
      transaction_id:z.number(),
    }))
    .mutation(({ ctx, input:{
      transaction_id,
    } })=>{
      return ctx.db.transaction.update({
        where : {
          id:transaction_id
        },
        data : {
          status : "CANCELLED"
        }
      })
    })
});
