import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { useStore } from "@/lib/store/app";
interface AssignRider { 
    riderIsLoading : boolean;
    refetchTransaction: ()=>void
    transactionIds : number[]
    grouped_delivery_id:number | null;
}
const CancelOrder = ({refetchTransaction, transactionIds, grouped_delivery_id}:AssignRider) => {
    const {user} = useStore()
    const { isRefetching } =
      api.transaction.getAdminOrders.useQuery(
        {
          admin_id: user?.id || 0,
        },
        {
          enabled: false,
        },
      );
    const { mutateAsync, isPending } = api.transaction.cancelTransaction.useMutation({
        onSuccess : async () => {
            await Promise.all([refetchTransaction()]);
            toast({
                title : "Cancelled",
                "description" : "Order cancelled."
            })
        }
    })
    const onCancel =async () => {
        await mutateAsync({
            transaction_ids : transactionIds,
            grouped_delivery_id : grouped_delivery_id||0
        })
    }
    return ( 
        <CardFooter className="flex flex-row items-center justify-end px-6 py-3">
            <Button size={"sm"} onClick={onCancel} variant={"destructive"} disabled={isPending || isRefetching}>Cancel Order</Button>
        </CardFooter> );
}
 
export default CancelOrder;