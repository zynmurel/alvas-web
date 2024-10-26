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
import { barangays, customer, delivery_rider, orders, products, transaction, type $Enums } from "@prisma/client"
import OpenShowTransaction from "./[id]/modal"

type StatusType = "PENDING" | "ONGOING" | "DONE" | "CANCELLED"

export type Transaction = {
  id: string;
  status: $Enums.transaction_status;
  customer_name: string;
  customer_contact?: string;
  sub_total: number;
  delivery_fee: number;
  total_amount: number;
  total_transactions: number;
  createdAt: Date;
  barangay: string;
  transactions: (transaction & {
    orders: (orders & { product: products })[];
    customer?: (customer & { barangay: barangays }) | null
  })[];
  rider: delivery_rider | null;
  grouped_delivery_id:number|null
}


const OrderPage = () => {
  const [status, setStatus] = useState<StatusType>("PENDING")
  const { user } = useStore()
  const [transaction, setTransaction] = useState<Transaction | undefined>(undefined)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const { data, isLoading: transactionsIsLoading, isRefetching: transactionsIsRefetching, refetch } = api.transaction.getAdminOrders.useQuery({
    admin_id: user?.id || 0
  }, {
    enabled: !!user
  })

  useEffect(() => {
    if (data) {
      setTransactions(data.filter((data) => data.status === status))
    }
  }, [data, status])

  return (
    <div className=" flex flex-col">
      <OpenShowTransaction transaction={transaction} setTransaction={setTransaction}/>
      <div className="mx-auto grid w-full gap-2">
        <h1 className="text-3xl font-semibold">Delivery Orders</h1>
        <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-4 min-h-[400px] px-6 py-2 space-y-5">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <Tabs defaultValue="PENDING" onValueChange={(e) => setStatus(e as StatusType)}>
              <div className="flex items-center">
                <TabsList className="grid grid-cols-5 w-[400px]">
                  <TabsTrigger value="PENDING">Pending</TabsTrigger>
                  <TabsTrigger value="ONGOING">Ongoing</TabsTrigger>
                  <TabsTrigger value="DELIVERED">Delivered</TabsTrigger>
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
                  transaction={transaction}
                  setTransaction={setTransaction}
                />
              </TabsContent>
              <TabsContent value="ONGOING">
                <OrdersContent status={"ONGOING"}
                  transactions={transactions}
                  transactionsIsLoading={transactionsIsLoading}
                  transactionsIsRefetching={transactionsIsRefetching}
                  transaction={transaction}
                  setTransaction={setTransaction}
                />
              </TabsContent>
              <TabsContent value="DELIVERED">
                <OrdersContent status={"DELIVERED"}
                  transactions={transactions}
                  transactionsIsLoading={transactionsIsLoading}
                  transactionsIsRefetching={transactionsIsRefetching}
                  transaction={transaction}
                  setTransaction={setTransaction}
                />
              </TabsContent>
              <TabsContent value="DONE">
                <OrdersContent status={"DONE"}
                  transactions={transactions}
                  transactionsIsLoading={transactionsIsLoading}
                  transactionsIsRefetching={transactionsIsRefetching}
                  transaction={transaction}
                  setTransaction={setTransaction}
                />
              </TabsContent>
              <TabsContent value="CANCELLED">
                <OrdersContent status={"CANCELLED"}
                  transactions={transactions}
                  transactionsIsLoading={transactionsIsLoading}
                  transactionsIsRefetching={transactionsIsRefetching}
                  transaction={transaction}
                  setTransaction={setTransaction}
                />
              </TabsContent>
            </Tabs>
          </div>
          {/* <div>
            <TransactionContext.Provider value={{refetchTransaction : refetchTransaction}}>
            {children}
            </TransactionContext.Provider>
          </div> */}
        </main>
      </div>
    </div>
  );
}

export default OrderPage;