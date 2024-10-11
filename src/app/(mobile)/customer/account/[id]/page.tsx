'use client'
import React, { useEffect } from "react"
import {
    Card,
} from "@/components/ui/card"
import { api } from "@/trpc/react"
import Loading from "../_components/loading"
import { useState } from "react"
import { useParams } from "next/navigation"
import { delivery_rider, orders, products, transaction } from "@prisma/client"

const statuses = ["ONGOING", "DONE", "CANCELLED"] as ("ONGOING"| "DONE"| "CANCELLED")[]

export type TransactionType = (transaction & {
    orders : (orders & {product : products})[],
    rider : delivery_rider | null
})

const Page = () => {
    const {id} = useParams()
    const [status, setStatus] = useState<"ONGOING"| "DONE"| "CANCELLED">("ONGOING")
    const [selectedTransaction ,setSelectedTransaction] = useState<TransactionType | undefined>(undefined)
    const [transactions, setTransactions] = useState<TransactionType[]>([])

    const { data, isLoading} = api.user_customer.transaction.getCustomerTransactions.useQuery({
        customer_id: Number(id),
    }, {
        enabled : !Number.isNaN(Number(id))
    })

    useEffect(()=>{
        if(data){
            setTransactions(data.filter(tra=>{
                if(status === "ONGOING"){
                    if(tra.status==="ONGOING" || tra.status==="PENDING"){
                        return true
                    }else{
                        return false
                    }
                }else {
                    return tra.status===status
                }
            }))
        }
    },[data, status])
    return (

        <div className="mx-auto grid w-full p-2">
            <div className="flex flex-row justify-between">
                <div>
                    <h1 className="text-base font-bold">Account Settings</h1>
                    <p className="text-muted-foreground text-xs">Modify your account information and settings.</p>
                </div>
                <div>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 md:gap-8">
                <Card x-chunk="dashboard-01-chunk-0" className=" bg-transparent border-none shadow-none">
                </Card>
            </div>
        </div>
    );
}

export default Page;