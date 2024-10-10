'use client'
import { useParams } from "next/navigation";
import React, { useEffect } from "react"
import { useStore } from "@/lib/store/app"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { api } from "@/trpc/react"
import Loading from "../_components/loading"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type $Enums } from "@prisma/client"

const sorting = [
    { category: "FRIED CHICKEN", value: 1 },
    { category: "CHICHARON", value: 2 },
    { category: "PORK SIOMAI", value: 3 },
    { category: "NGOHIONG", value: 4 },
    { category: "PANCIT PALABOK", value: 5 },
    { category: "SIOPAO", value: 6 },
    { category: "DRINKS", value: 7 },
    { category: "RICE", value: 8 },
]

export type ProductType = {
    id: number;
    product_name: string;
    image_url: string;
    admin_id: number;
    category_id: number;
    quantity: number;
    amount: number;
    status: $Enums.product_status;
    createdAt: Date;
    updatedAt: Date;
}

type StatusType = "PENDING" | "ONGOING" | "DONE" | "CANCELLED"


const Page = () => {
    const [category, setCategory] = useState("ALL")
    const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([])
    const [submitOrderOpen, setSubmitOrderOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<ProductType | undefined>(undefined)
    const { data: products, isLoading: productsIsLoading } = api.user_cashier.order.getProducts.useQuery()
    const productsToShow = () => {
        if (products) {
            const prod = products.map((prods, index) => {
                const sortValue = sorting.find(sor => sor.category === prods.category)?.value || index + 100
                return {
                    ...prods,
                    sortValue
                }
            }).sort((productA, productB) => productA.sortValue - productB.sortValue)
            if (category === "ALL") {
                return prod
            } else {
                return prod.filter((prod) => prod.category === category)
            }
        } else {
            return []
        }
    }

    const totalAmount = selectedProducts.reduce((arr, curr) => {
        return arr + (curr.amount * curr.quantity)
    }, 0)
    return (
        <Card x-chunk="dashboard-01-chunk-0" className=" bg-transparent border-none shadow-none">
            <div className=" flex flex-row justify-between items-end p-0 z-50 bg-white mt-2">
                <div>
                </div>
                <Select
                    onValueChange={setCategory}
                    value={category}
                    disabled={productsIsLoading}
                >
                    <SelectTrigger className=" w-32 text-xs">
                        <SelectValue className=" capitalize text-xs" placeholder={`${productsIsLoading ? "Loading..." : "Product Category"}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            [{ category: "ALL" }, ...(products || [])]?.map((prod) => (<SelectItem value={prod.category} key={prod.category} className=" capitalize text-xs">{prod.category}</SelectItem>))
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className=" relative rounded overflow-y-auto min-h-[300px] bg-green-700 border px-2 p-1 w-full grid mt-1" style={{ maxHeight:"80vh"}}>
                {(productsIsLoading) &&
                    <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <Loading />
                    </div>}
                <div className=" flex flex-col gap-2 overflow-hidden">
                    {
                        productsToShow()?.map((prod) => {
                            return <div key={prod.category} className=" w-full">
                                <p className=" font-bold text-base text-white">{prod.category}</p>
                                <div className={`  w-full overflow-hidden overflow-x-auto flex  flex-row bg-white border-slate-100 rounded border p-1 gap-1 ${category !== "ALL" && 'flex-wrap'}`}>
                                    {
                                        prod.products.map((product) => {
                                            return <div onClick={() => setSelectedProduct({ ...product, quantity: 1 })} key={product.id} className={` hover:scale-105 transition-all cursor-pointer flex flex-col flex-none h-36 border justify-end rounded w-28 relative overflow-hidden`}>
                                                <div className=" absolute bg-white rounded overflow-hidden top-0 left-0 right-0 bottom-0">
                                                    <img src={product.image_url} alt={product.id.toString()} className=" h-full w-full object-cover" />
                                                </div>
                                                <div className=" self-end text-xs w-full p-2 z-10 bg-black text-white bg-opacity-70">
                                                    {product.product_name}
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </Card>
    );
}

export default Page;