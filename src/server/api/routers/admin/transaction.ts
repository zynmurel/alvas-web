import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const transactionRouter = createTRPCRouter({
  getAdminOrders: publicProcedure
  .input(z.object({
    admin_id : z.number()
  }))
    .query(({ ctx, input : {admin_id}}) => {
      return ctx.db.transaction.findMany({
        where :{
          admin_id,
            transaction_type : "DELIVERY"
        },
        include : {
            orders:true,
            customer:true
        },
        orderBy : {
          createdAt:"desc"
        }
      }).then((transactions)=>(
        transactions.map((transaction)=>({
            id : transaction.id,
            customer_name : `${transaction.customer?.first_name} ${transaction.customer?.middle_name[0]}. ${transaction.customer?.last_name}`,
            customer_contact : transaction.customer?.contact_number,
            sub_total: transaction.total_amount,
            createdAt: transaction.createdAt,
            status: transaction.status,
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
              name :`${transaction.customer?.first_name} ${transaction.customer?.middle_name[0]}. ${transaction.customer?.last_name}`,
              contact_number : transaction.customer?.contact_number
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
    .mutation(async({ ctx, input:{
      transaction_id,
      rider_id
    } })=>{
      const settings = await ctx.db.settings.findFirst()
      if(settings){
        return ctx.db.transaction.update({
          where : {
            id:transaction_id
          },
          data : {
            delivery_rider_id : rider_id,
            status : "ONGOING",
            delivery_fee :settings?.delivery_fee || 0
          }
        })
      } else {
        return null
      }
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
    }),
    doneTransaction :publicProcedure
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
          status : "DONE"
        }
      })
    }),
    getTransactionsByStatus  :publicProcedure
    .input(z.object({
      admin_id:z.number(),
      transaction_type:z.enum(["DINE_IN", "DELIVERY", "PICK_UP", "ALL"]),
      date : z.object({
        from : z.date(),
        to : z.date()
      })
    }))
    .query(({ ctx, input:{
      admin_id,
      transaction_type,
      date
    } })=>{
      const whereTransactionType = transaction_type === "ALL" ? {} : { transaction_type: transaction_type }
      return ctx.db.transaction.findMany({
        where : {
          admin_id,
          status :"DONE",
          createdAt : {
            gte : date.from,
            lte : date.to
          },
          ...whereTransactionType
        },
        include : {
          cashier : true,
          rider : true,
          customer : true,
        }
      }).then((transacs)=>{
        const transactions = transacs.map((transaction)=>{
          return {
            id : transaction.id,
            total_amount : transaction.total_amount,
            transact_by : transaction.rider || transaction.cashier,
            transact_by_type : transaction.rider ? "Rider" : "Cashier",
            transaction_type : transaction.rider ? "DELIVERY" : "DINE_IN",
            delivery_fee : transaction.delivery_fee,
          }
        })
        const total_sub_total = transactions.reduce(
          (accumulator, currentValue) => accumulator + currentValue.total_amount,
          0,
        );
        const total_delivery_fee = transactions.reduce(
          (accumulator, currentValue) => accumulator + (currentValue.delivery_fee || 0),
          0,
        );
        return {
          transactions,
          total_transactions : transactions.length,
          total_sub_total,
          total_delivery_fee,
          total_amount : total_sub_total + total_delivery_fee,
        }
          
      })
    }),
});
