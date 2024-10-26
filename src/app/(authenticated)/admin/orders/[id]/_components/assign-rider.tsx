import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Command } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon, LoaderCircle, Truck } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransactionContext } from "../../context/transaction";
interface AssignRider { 
    riders:{
        label: string;
        value: number;
    }[] | undefined;
    searchRider:string;
    setSearchRider:(text:string)=>void 
    riderIsLoading : boolean;
    refetchTransaction: ()=>void;
    transactionIds : number[]
    delivery_fee:number
}

const AssignRiderForm = z.object({
    rider_id: z.number().nullish(),
});

const AssignRider = ({riders, searchRider, transactionIds, delivery_fee, setSearchRider, riderIsLoading, refetchTransaction}:AssignRider) => {
    const trContext = useTransactionContext()
    const form = useForm<z.infer<typeof AssignRiderForm>>({
        resolver: zodResolver(AssignRiderForm),
    });

    const { mutateAsync:assignRiderToTransaction, isPending:assignRiderToTransactionIsPending } = api.transaction.assignRiderToTransaction.useMutation({
        onSuccess :async () => {
            refetchTransaction()
            await trContext?.refetchTransaction()
            toast({
                title : "Success",
                "description" : "Rider assigned successfully. Transaction moved to ongoing."
            })
        }
    })

    const onSubmit = async(data: z.infer<typeof AssignRiderForm>) => {
        if(!!data.rider_id){
            await assignRiderToTransaction({
                rider_id : data.rider_id,
                transaction_ids:transactionIds,
                delivery_fee : delivery_fee
            })
        } else {
            form.setError("rider_id", { message : "Rider is required"})
        }
    }
    const onSelectRider = (rider_id: number) => {
      if (form.getValues("rider_id") === rider_id) {
        form.setValue("rider_id", null);
      } else {
        form.setValue("rider_id", rider_id);
        form.clearErrors("rider_id");
      }
    };

    return (
        <CardFooter className="flex flex-row items-center justify-end px-6 py-3">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" w-full flex flex-row items-center gap-3 justify-center"
                >
                    <FormField
                        control={form.control}
                        name="rider_id"
                        render={({ field }) => (
                            <FormItem className="relative flex flex-col w-[200px]">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "pl-3 text-left font-normal flex justify-between overflow-hidden",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? riders?.find((rider) => rider.value === field.value)
                                                        ?.label
                                                    : "Select rider"}
                                                <CaretSortIcon className="w-4 h-4 opacity-50 shrink-0" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[250px] p-0">
                                        <Command>
                                            <Input
                                                value={searchRider}
                                                onChange={(e) => setSearchRider(e.target.value)}
                                                placeholder="Search account number or name"
                                                className="w-auto m-1 border-none h-9 max-w-[100]"
                                            />
                                            {/* <CommandEmpty>No Agent Found</CommandEmpty> */}
                                            <div className="p-1">
                                                {riderIsLoading ? <div className=" w-full flex items-center justify-center"><LoaderCircle className=" animate-spin"/></div> : 
                                                riders?.map((rider) => (
                                                    <div
                                                        className={`flex flex-row items-center px-2 py-1.5 text-sm font-light rounded cursor-pointer hover:bg-gray-100 ${rider.value === field.value && "bg-gray-100"
                                                            }`}
                                                        key={rider.value}
                                                        onClick={() => onSelectRider(rider.value)}
                                                    >
                                                        {rider.label}
                                                        <CheckIcon
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                rider.value === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </div>
                                                ))}
                                                
                                            </div>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage className="absolute -bottom-4" />
                            </FormItem>
                        )}
                    />
                    <Button disabled={assignRiderToTransactionIsPending} size={"sm"} className=" flex flex-row items-center gap-1 self-end"><Truck size={15} />Assign Rider</Button>
                </form>
            </Form>
        </CardFooter>
    );
}

export default AssignRider;