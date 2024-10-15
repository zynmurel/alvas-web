'use client'
import { api } from "@/trpc/react";
import Loading from "../../_components/loading";
import OrderModal from "./order-modal";
import { type TransactionType } from "../page";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { formatCurrency } from "@/app/_utils/format";
import { format } from "date-fns";

const Delivered = () => {
    const { id } = useParams()
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | undefined>(undefined)
    const { data, isRefetching: isLoadingDelivered } = api.user_rider.delivery.getTransactionsDelivered.useQuery({
        id: Number(id),
    }, {
        enabled: false
    })
    const totalAmount = data?.reduce((arr, curr) => {
        return arr + ((curr.delivery_fee||0) + curr.total_amount)
    }, 0) || 0
    return (<div className=" relative rounded overflow-y-auto min-h-[200px] bg-white w-full " style={{ maxHeight: "80vh" }}>
        <OrderModal open={selectedTransaction} setOpen={setSelectedTransaction} />
        {
            (isLoadingDelivered) &&
            <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <Loading />
            </div>
        }
        <div className=" flex flex-col rounded-lg bg-green-700 text-white text-xs p-2">
            <div className=" text-base font-bold">Remittance Details</div>
            <div>Details of delivered items to be remitted to the admin</div>
            <div className=" flex flex-col items-center">
                <div className="font-semibold w-full rounded-lg bg-green-900 text-center p-2 mt-2">Completed Deliveries: {data?.length||0}

                <div className=" text-xl">{formatCurrency(totalAmount)}</div>
                </div>
            </div>
        </div>
        <Separator className=" my-2" />
        <div className=" flex flex-col overflow-y-auto" style={{ maxHeight: "60vh" }}>
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

export default Delivered;