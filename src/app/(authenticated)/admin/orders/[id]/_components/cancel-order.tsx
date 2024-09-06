import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useTransactionContext } from "../../layout";
import { toast } from "@/components/ui/use-toast";
interface AssignRider { 
    riderIsLoading : boolean;
    refetchTransaction: ()=>void
}
const CancelOrder = ({riderIsLoading, refetchTransaction}:AssignRider) => {
    const { id } = useParams()
    const transactionContext = useTransactionContext()
    const { mutateAsync, isPending } = api.transaction.cancelTransaction.useMutation({
        onSuccess : () => {
            refetchTransaction()
            transactionContext?.refetchTransaction()
            toast({
                title : "Cancelled",
                "description" : "Order cancelled."
            })
        }
    })
    const onCancel =async () => {
        await mutateAsync({
            transaction_id : Number(id)
        })
    }
    return ( 
        <CardFooter className="flex flex-row items-center justify-end border-t bg-muted/50 px-6 py-3">
            <Button size={"sm"} onClick={onCancel} variant={"destructive"} disabled={isPending}>Cancel Order</Button>
        </CardFooter> );
}
 
export default CancelOrder;