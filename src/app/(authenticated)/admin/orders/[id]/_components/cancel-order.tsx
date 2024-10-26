import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useTransactionContext } from "../../context/transaction";
import { toast } from "@/components/ui/use-toast";
interface AssignRider { 
    riderIsLoading : boolean;
    refetchTransaction: ()=>void
    transactionIds : number[]
    grouped_delivery_id:number | null;
}
const CancelOrder = ({refetchTransaction, transactionIds, grouped_delivery_id}:AssignRider) => {
    const trContext = useTransactionContext()
    const { mutateAsync, isPending } = api.transaction.cancelTransaction.useMutation({
        onSuccess : async () => {
            refetchTransaction()
            await trContext?.refetchTransaction()
            toast({
                title : "Cancelled",
                "description" : "Order cancelled."
            })
        }
    })
    const onCancel =async () => {
        console.log(grouped_delivery_id)
        await mutateAsync({
            transaction_ids : transactionIds,
            grouped_delivery_id : grouped_delivery_id||0
        })
    }
    return ( 
        <CardFooter className="flex flex-row items-center justify-end px-6 py-3">
            <Button size={"sm"} onClick={onCancel} variant={"destructive"} disabled={isPending}>Cancel Order</Button>
        </CardFooter> );
}
 
export default CancelOrder;