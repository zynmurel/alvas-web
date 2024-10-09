import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useTransactionContext } from "../../context/transaction";
import { toast } from "@/components/ui/use-toast";
interface AssignRider { 
    riderIsLoading : boolean;
    refetchTransaction: ()=>void
}
const CancelOrder = ({refetchTransaction}:AssignRider) => {
    const { id } = useParams()
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