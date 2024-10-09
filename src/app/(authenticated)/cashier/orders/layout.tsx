'use client'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import OrdersContent from "./_components/orders"
import { api } from "@/trpc/react"
import React, { useEffect, useState } from "react"
import { TransactionContext } from "./context/transaction"
import { useStore } from "@/lib/store/app"
import { $Enums } from "@prisma/client"

type StatusType ="PENDING" | "ONGOING" | "DONE" | "CANCELLED"



const OrderPage = ({
  children,
}: Readonly<{ children: React.ReactElement }>) => {
  const [status, setStatus] = useState<StatusType>("ONGOING")
  const {user} = useStore()
  const [transactions, setTransactions] = useState<{
    id: number;
    customer_name: string;
    customer_contact: string | undefined;
    sub_total: number;
    delivery_fee: number;
    total_amount: number;
    status: $Enums.transaction_status
}[]>([])

  const { data, isLoading : transactionsIsLoading, isRefetching :transactionsIsRefetching, refetch } = api.transaction.getAdminOrders.useQuery({
    admin_id : user?.id || 0
  }, {
    enabled : !!user
  })

  const refetchTransaction = async () => {
    await refetch()
  }

  useEffect(()=>{ 
    if(data){
      setTransactions(data.filter((data)=> data.status === status))
    }
   },[data, status])

  return (
    <div className=" flex flex-col">
        <div className="mx-auto grid w-full max-w-7xl gap-2">
        <h1 className="text-3xl font-semibold">Delivery Orders</h1>
        <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-4 lg:grid-cols-3 xl:grid-cols-3 min-h-[400px] px-6 py-2 space-y-5 lg:px-10 lg:container">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Tabs defaultValue="ONGOING" value={status}  onValueChange={(e)=>setStatus(e as StatusType)}>
              <div className="flex items-center">
                <TabsList className="grid grid-cols-2 w-[400px]">
                  <TabsTrigger value="ONGOING">Ongoing</TabsTrigger>
                  <TabsTrigger value="DELIVERED">Delivered</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="ONGOING">
                <OrdersContent status={"ONGOING"} 
                transactions={transactions}
                transactionsIsLoading={transactionsIsLoading}
                transactionsIsRefetching={transactionsIsRefetching}
                />
              </TabsContent>
              <TabsContent value="DELIVERED">
                <OrdersContent status={"DELIVERED"} 
                transactions={transactions}
                transactionsIsLoading={transactionsIsLoading}
                transactionsIsRefetching={transactionsIsRefetching}
                />
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <TransactionContext.Provider value={{refetchTransaction : refetchTransaction}}>
            {children}
            </TransactionContext.Provider>
          </div>
        </main>
      </div>
    </div>
  );
}

export default OrderPage;