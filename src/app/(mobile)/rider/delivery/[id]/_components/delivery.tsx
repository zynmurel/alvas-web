'use client'
import { api } from "@/trpc/react";
import Loading from "../../_components/loading";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { formatCurrency } from "@/app/helper/format";
import { type TransactionType } from "../page";
import { useState } from "react";
import OrderModal from "./order-modal";

const ForDelivery = () => {
    const { id } = useParams()
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | undefined>(undefined)
    const { data, isRefetching: isLoadingForDelivery } = api.user_rider.delivery.getTransactionsForDelivery.useQuery({
        id: Number(id),
    }, {
        enabled: false
    })
    return (<div className=" relative rounded overflow-y-auto min-h-[200px] bg-white w-full" style={{ maxHeight: "80vh" }}>
        <OrderModal open={selectedTransaction} setOpen={setSelectedTransaction} />
        {
            (isLoadingForDelivery) &&
            <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <Loading />
            </div>
        }
        <Separator className="" />
        <div className=" flex flex-col overflow-y-auto" style={{ maxHeight: "90vh" }}>
            {
                data?.map((delivery) => {
                    const customer = delivery.customer
                    return <div onClick={() => setSelectedTransaction(delivery)} key={delivery.id} className=" p-2 px-4 rounded text-xs flex items-center flex-row border-b">
                        <div>
                            <div className=" font-semibold text-muted-foreground">{customer ? `${customer.first_name} ${customer.middle_name ? customer.middle_name[0] + "." : ""} ${customer.last_name}` : ""}</div>
                            <div className=" font-bold text-sm">{customer?.contact_number}</div>
                        </div>

                        <div className=" flex flex-col items-end flex-1">
                            <div className=" font-semibold text-muted-foreground">{format(delivery.createdAt, "P hh:mm aa")}</div>
                            <div className=" font-bold text-sm">{formatCurrency(delivery.total_amount + (delivery.delivery_fee || 0))}</div>
                        </div>
                    </div>
                })
            }
        </div>
    </div>);
}

export default ForDelivery;