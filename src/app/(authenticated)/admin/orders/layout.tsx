'use client'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import OrdersContent from "./_components/orders"
import { api } from "@/trpc/react"
import React, { createContext, useContext, useState } from "react"

type StatusType ="PENDING" | "ONGOING" | "DONE" | "CANCELLED"

const TransactionContext = createContext({ refetchTransaction : () => {}});

export const useTransactionContext = () => useContext(TransactionContext);

const OrderPage = ({
  children,
}: Readonly<{ children: React.ReactElement }>) => {
  const [status, setStatus] = useState<StatusType>("PENDING")

  const { data:transactions, isLoading : transactionsIsLoading, isRefetching :transactionsIsRefetching, refetch } = api.transaction.getAdminOrders.useQuery({
    status
  })

  return (
    <div className=" flex flex-col">
      <div className="mx-auto grid w-full max-w-7xl gap-2">
        <h1 className="text-3xl font-semibold">Delivery Orders</h1>

        <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-4 lg:grid-cols-3 xl:grid-cols-3 min-h-[400px]">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Tabs defaultValue="PENDING" onValueChange={(e)=>setStatus(e as StatusType)}>
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="PENDING">Pending</TabsTrigger>
                  <TabsTrigger value="ONGOING">Ongoing</TabsTrigger>
                  <TabsTrigger value="DONE">Done</TabsTrigger>
                  <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="PENDING">
                <OrdersContent 
                status={"PENDING"} 
                transactions={transactions}
                transactionsIsLoading={transactionsIsLoading}
                transactionsIsRefetching={transactionsIsRefetching}
                />
              </TabsContent>
              <TabsContent value="ONGOING">
                <OrdersContent status={"ONGOING"} 
                transactions={transactions}
                transactionsIsLoading={transactionsIsLoading}
                transactionsIsRefetching={transactionsIsRefetching}
                />
              </TabsContent>
              <TabsContent value="DONE">
                <OrdersContent status={"DONE"} 
                transactions={transactions}
                transactionsIsLoading={transactionsIsLoading}
                transactionsIsRefetching={transactionsIsRefetching}
                />
              </TabsContent>
              <TabsContent value="CANCELLED">
                <OrdersContent status={"CANCELLED"} 
                transactions={transactions}
                transactionsIsLoading={transactionsIsLoading}
                transactionsIsRefetching={transactionsIsRefetching}
                />
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <TransactionContext.Provider value={{refetchTransaction : refetch}}>
            {children}
            </TransactionContext.Provider>
          </div>
        </main>
      </div>
    </div>
  );
}

export default OrderPage;