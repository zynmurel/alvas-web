import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { type ProductType } from "../page";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/app/_utils/format";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import Loading from "../../_components/loading";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { Minus } from "lucide-react";
import { type settings } from "@prisma/client";

export function SubmitOrderModal({ open, setOpen, products, setProducts, settings }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    settings: settings | null | undefined;
    products: ProductType[]
    setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>
}) {
    const { id } = useParams()

    const {  refetch } = api.user_customer.transaction.getCustomerTransactions.useQuery({
        customer_id: Number(id),
    }, {
        enabled : false
    })
    const { mutateAsync, isPending } = api.user_customer.order.confirmCustomerOrders.useMutation({
        onSuccess: async () => {
            toast({
                title: "Confirmed",
                description: "Order Confirmed"
            })
            setOpen(false)
            setProducts([])
            await refetch()
        },
        onError: (e) => {
            toast({
                variant: "destructive",
                title: "Failed",
                description: e.message
            })
        }
    })

    if (!open) return <></>

    const totalAmount = products.reduce((arr, curr) => {
        return arr + (curr.amount * curr.quantity)
    }, 0)


    const onSubmit = async () => {
        if (!Number.isNaN(Number(id))) {
            await mutateAsync({
                total_amount: totalAmount,
                customer_id: Number(id),
                orders: products.map((prod) => ({
                    product_id: prod.id,
                    quantity: prod.quantity
                }
                ))
            })
        }
    }
    const onMinus = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                {(isPending) &&
                    <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <Loading />
                    </div>}

                {
                    !!products.length ? <DialogHeader>
                    <DialogTitle>Products on Basket</DialogTitle>
                    <DialogDescription>
                        Confirm your selected products.
                    </DialogDescription>
                </DialogHeader>:<DialogHeader>
                        <DialogTitle>Empty Basket</DialogTitle>
                        <DialogDescription>
                            Selected products and add it into the basket.
                        </DialogDescription>
                    </DialogHeader>}
                <div className="flex flex-row gap-4 pt-4">
                    {
                        !!products.length && <div className=" text-sm w-full">
                            <p className=" font-semibold">Orders</p>
                            <Separator className=" my-2" />
                            <div className=" flex flex-col gap-4 w-full overflow-scroll" style={{ maxHeight: "50vh" }}>
                                {
                                    products?.map((product) => {
                                        return <div key={product.id} onClick={() => onMinus(product.id)} className=" flex flex-row justify-between w-full">
                                            <p>{product.product_name} X {product.quantity}</p>
                                            <div className=" flex flex-row gap-2">
                                                <p>{formatCurrency(product.amount * product.quantity)}</p>
                                                <div className=" text-white"><Minus strokeWidth={3} size={20} className=" bg-red-500 rounded" /></div>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                            <div>

                                <Separator className=" my-2" />
                                <div className=" flex flex-row w-full justify-between">
                                    <p className="">Sub Total</p>
                                    <p className=" font-semibold">{formatCurrency(totalAmount)}</p>
                                </div>
                                <div className=" flex flex-row w-full justify-between">
                                    <p className="">Delivery Fee</p>
                                    <p className=" font-semibold">{formatCurrency(settings?.delivery_fee || 0)}</p>
                                </div>
                                <Separator className=" my-2" />
                                <div className=" flex flex-row w-full justify-between">
                                    <p className=" font-semibold">Total Amount</p>
                                    <p className=" font-semibold">{formatCurrency(totalAmount + (settings?.delivery_fee || 0))}</p>
                                </div>
                                <div className=" flex flex-row justify-end gap-2 w-full mt-5">
                                    <Button onClick={() => setOpen(false)} variant={"outline"}>Cancel</Button>
                                    <Button onClick={onSubmit} className="">Submit Order</Button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}
