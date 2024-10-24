'use client'
import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { api } from "@/trpc/react"
import { useParams } from "next/navigation"
import LoadingOrder from "./_components/loading"
import OrderNotFound from "./_components/not-found"
import { formatCurrency, timeDate, timeZone } from "@/app/helper/format"
import { Badge } from "@/components/ui/badge"
import { type $Enums } from "@prisma/client"
import AssignRider from "./_components/assign-rider"
import CancelOrder from "./_components/cancel-order"
import MarkDoneOrder from "./_components/mark-done-order"
import { format } from "date-fns-tz"

const BadgeStatus = ({status}:{status : $Enums.transaction_status}) => {
  if(status==="PENDING"){
    return <Badge variant={"outline"} className=" border-orange-300 text-orange-400">{status}</Badge>
  } else if(status==="ONGOING"){
    return <Badge variant={"outline"}>{status}</Badge>
  } else if(status==="DONE"){
    return <Badge>{status}</Badge>
  }else if(status==="DELIVERED"){
    return <Badge className=" bg-blue-500 text-white">{status}</Badge>
  } else if(status==="CANCELLED"){
    return <Badge variant={"destructive"}>{status}</Badge>
  }
}

const Page = () => {
  const { id } = useParams()
  const [searchRider, setSearchRider] = React.useState("")
  
  const { data:transaction, isLoading: transactionIsLoading, isRefetching, refetch:refetchTransaction } = api.transaction.getAdminOrder.useQuery({
    id : Number(id)
  },{
    enabled : typeof Number(id) === "number"
  })

  const { data:riders, isLoading:riderIsLoading } = api.rider.getRiderForSelect.useQuery({
      name_text : searchRider
  })
  if(!transaction && !transactionIsLoading){
    return <OrderNotFound/>
  }
  if(transactionIsLoading || isRefetching){
    return <LoadingOrder/>
  }
  if(transaction){

    const boholTimeDate = timeDate(transaction.order_date)
    return ( <Card
      className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
    >
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5 w-full">
          <CardTitle className=" flex items-center gap-2 text-lg w-full justify-between">
            Order <BadgeStatus status={transaction.status}/>
          </CardTitle>
          <CardDescription>Date: {format(boholTimeDate, "PPP", {timeZone:timeZone})}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm pt-2">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
            {
              transaction?.order_details.orders.map((order, index)=>(
            <li className="flex items-center justify-between" key={index}>
              <span className="text-muted-foreground">
                {order.product_name} x <span>{order.quantity}</span>
              </span>
              <span>{formatCurrency(order.price)}</span>
            </li>
              ))
            }
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(transaction.order_details.sub_total)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>{formatCurrency(transaction.order_details.delivery_fee)}</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>{formatCurrency(transaction.order_details.sub_total + transaction.order_details.delivery_fee)}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Customer Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Customer</dt>
              <dd>{transaction.customer_info.name}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Contact</dt>
              <dd>
                <a href="tel:">{transaction.customer_info.contact_number}</a>
              </dd>
            </div>
          </dl>
        </div>
        {
          transaction.delivery_info && transaction.status!=="PENDING" && 
          <>
          <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Delivery Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Rider</dt>
                  <dd>{transaction.delivery_info.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Contact</dt>
                  <dd>
                    <a href="tel:">{transaction.delivery_info.contact_number}</a>
                  </dd>
                </div>
              </dl>
            </div>
          </>
        }
      </CardContent>
      {
        transaction.status === "PENDING" && 
        <AssignRider 
        riderIsLoading={riderIsLoading} 
        riders={riders} 
        searchRider={searchRider} 
        setSearchRider={setSearchRider}
        refetchTransaction={refetchTransaction}
        />
      }
      {
        transaction.status === "ONGOING" && 
        <CancelOrder
        riderIsLoading={riderIsLoading} 
        refetchTransaction={refetchTransaction}
        />
      }
      {
        transaction.status === "DELIVERED" && 
        <MarkDoneOrder
        riderIsLoading={riderIsLoading} 
        refetchTransaction={refetchTransaction}
        />
      }
    </Card> );
  } else {
    return <></>
  }
   
}
 
export default Page;