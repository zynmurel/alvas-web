
"use client"

import * as React from "react"
import { format, setHours, startOfMonth } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/trpc/react"
import { useStore } from "@/lib/store/app"
import TransactionTable from "./_components/transaction-table"
import Loading from "../_components/loading"
import NoFound from "./_components/table-components/no-found"
import { DataPagination } from "./_components/table-components/pagination"
import { type PaginationType } from "@/lib/types/pagination"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { formatCurrency } from "@/app/_utils/format"
type TransactionType = "DINE_IN" | "DELIVERY" | "ALL" | "PICK_UP"
const Transactions = () => {
  const [transactionType, setTransactionType] = useState<TransactionType>("ALL")
  const { user } = useStore()
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(setHours(new Date, 0)),
    to: setHours(new Date(), 24),
  })
  const [pagination, setPagination] = useState<PaginationType>({
    take: 10,
    skip: 0
  })
  const { data: transactions, isPending: transactionsIsPending } = api.transaction.getTransactionsByStatus.useQuery({
    transaction_type: transactionType,
    admin_id: user?.id || 0,
    date: date as { from: Date, to: Date }
  }, {
    enabled: !!date?.from && !!date?.to && !!user?.id
  })
  return (
    <div className="w-full grid lg:grid-cols-3 gap-5">
      <Tabs defaultValue="ALL" className=" lg:col-span-2" onValueChange={(e) => setTransactionType(e as TransactionType)}>
        <div className=" flex w-full flex-col gap-2 md:flex-row justify-between items-center">
          <TabsList className="grid grid-cols-3 w-[300px]">
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="DINE_IN">Dine In</TabsTrigger>
            <TabsTrigger value="DELIVERY">Delivery</TabsTrigger>
          </TabsList>
          <div className={cn("grid gap-2")}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Card className=" mt-3">
          <CardHeader className="flex flex-row items-start capitalize font-bold">
            {transactionType.toLowerCase().replace("_", " ")} Transactions
          </CardHeader>
          <CardContent>
            <TransactionTable transactions={transactions?.transactions} />
            {transactionsIsPending && <Loading />}
            {!transactionsIsPending && !transactions?.transactions?.length && <NoFound />}
            <DataPagination count={transactions?.transactions?.length || 0} filter={pagination} setFilter={setPagination} />
          </CardContent>
        </Card>
      </Tabs>
      <Card>
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center flex-col gap-2 text-lg">
              Filtered Transaction Overview
            </CardTitle>
            <div className=" text-gray-500 text-sm">Date : <span>{format(date?.from || new Date, "PP")} - {format(date?.to || new Date, "PP")}</span></div>
            <div className=" text-gray-500 text-sm capitalize">Type : <span>{transactionType.toLowerCase().replace("_", " ")}</span></div>
          </div>
        </CardHeader>
        {transactionsIsPending ? <Loading/> : <CardContent className=" text-sm">
        <div className="font-semibold mt-5">Overview Details</div>
          <div className=" mt-5">
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Transaction Count</span>
                <span>{(transactions?.total_transactions || 0)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Partial Total</span>
                <span>{formatCurrency(transactions?.total_sub_total || 0)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Delivery Fee Collected</span>
                <span>{formatCurrency(transactions?.total_delivery_fee || 0)}</span>
              </li>
            </ul>
          </div>
          <Separator className="my-4 border" />
          <li className="flex items-center justify-between font-semibold">
            <span className="text-muted-foreground">Total</span>
            <span>{formatCurrency((transactions?.total_sub_total || 0) + (transactions?.total_delivery_fee || 0))}</span>
          </li>
        </CardContent>}
      </Card>
    </div>);
}

export default Transactions;