import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Command } from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PopoverClose } from "@radix-ui/react-popover";
interface AssignRider {
  riders:
    | {
        label: string;
        value: number;
        barangay: string;
        isOngoing: boolean;
        deliveryCount: number;
      }[]
    | undefined;
  searchRider: string;
  setSearchRider: (text: string) => void;
  riderIsLoading: boolean;
  refetchTransaction: () => void;
  transactionIds: number[];
  delivery_fee: number;
  barangay: string;
}

const AssignRiderForm = z.object({
  rider_id: z.number().nullish(),
});

const AssignRider = ({
  riders,
  searchRider,
  transactionIds,
  delivery_fee,
  setSearchRider,
  riderIsLoading,
  refetchTransaction,
  barangay,
}: AssignRider) => {
  const form = useForm<z.infer<typeof AssignRiderForm>>({
    resolver: zodResolver(AssignRiderForm),
  });
  const { isRefetching } = api.rider.getRiderForSelect.useQuery();
  const {
    mutateAsync: assignRiderToTransaction,
    isPending: assignRiderToTransactionIsPending,
  } = api.transaction.assignRiderToTransaction.useMutation({
    onSuccess: async () => {
      await Promise.all([refetchTransaction()]);
      toast({
        title: "Success",
        description:
          "Rider assigned successfully. Transaction moved to ongoing.",
      });
    },
  });

  const onSubmit = async (riderId: number) => {
    if (!!riderId) {
      if (form.getValues("rider_id") === riderId) {
        form.setValue("rider_id", null);
      } else {
        form.setValue("rider_id", riderId);
        form.clearErrors("rider_id");
      }
      await assignRiderToTransaction({
        rider_id: riderId,
        transaction_ids: transactionIds,
        delivery_fee: delivery_fee,
      });
    } else {
      form.setError("rider_id", { message: "Rider is required" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={() => {}} className="">
        <FormField
          control={form.control}
          name="rider_id"
          render={({ field }) => (
            <FormItem className="relative flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={
                        assignRiderToTransactionIsPending || isRefetching
                      }
                      size={"sm"}
                      className="flex flex-row items-center gap-1 self-end"
                    >
                      <Truck size={15} />
                      Assign
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="end" className="relative w-[450px] p-0">
                  {isRefetching ||
                    (assignRiderToTransactionIsPending && (
                      <div className="absolute bottom-0 left-0 right-0 top-0 z-30 flex items-center justify-center bg-white opacity-50">
                        <LoaderCircle className="animate-spin" />
                      </div>
                    ))}
                  <Command>
                    <div className="flex flex-row items-center gap-1 px-3 pt-2 text-base font-bold">
                      <Truck size={18} strokeWidth={3} />
                      Riders
                    </div>
                    <Input
                      value={searchRider}
                      onChange={(e) => setSearchRider(e.target.value)}
                      placeholder="Search rider name"
                      className="m-2 mx-3 h-9 w-auto max-w-[100] border-none"
                    />
                    {/* <CommandEmpty>No Agent Found</CommandEmpty> */}
                    <div className="flex flex-col gap-1 p-2 px-3 pt-0">
                      {riderIsLoading ? (
                        <div className="flex w-full items-center justify-center">
                          <LoaderCircle className="animate-spin" />
                        </div>
                      ) : (
                        riders?.map((rider) => {
                          const buttonIsEnabled = rider.barangay === barangay;
                          return buttonIsEnabled || !rider.isOngoing ? (
                            <PopoverClose
                              className={`flex flex-row items-center rounded px-2 py-1.5 text-sm font-semibold ${
                                !rider.isOngoing || buttonIsEnabled
                                  ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                  : "cursor-not-allowed bg-slate-50 text-muted-foreground dark:bg-secondary"
                              }`}
                              key={rider.value}
                              onClick={() => onSubmit(rider.value)}
                            >
                              <div className="flex w-full flex-row items-center justify-between">
                                <div className="flex flex-row items-center">
                                  <p className="mr-2 flex items-center justify-center rounded-full bg-slate-200 p-1 px-2 text-xs text-slate-600">
                                    {rider.deliveryCount} Delivered
                                  </p>
                                  {rider.label}{" "}
                                  {rider.isOngoing && `(in ${rider.barangay})`}
                                </div>
                                <div
                                  className={`rounded-xl p-1 px-2 text-xs text-white ${rider.isOngoing ? "bg-blue-500" : "bg-green-500"}`}
                                >
                                  {rider.isOngoing ? "Ongoing" : "Available"}
                                </div>
                              </div>
                            </PopoverClose>
                          ) : (
                            <div
                              className={`flex flex-row items-center rounded px-2 py-1.5 text-sm font-semibold ${
                                !rider.isOngoing || buttonIsEnabled
                                  ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                  : "cursor-not-allowed bg-slate-50 text-muted-foreground dark:bg-secondary"
                              }`}
                              key={rider.value}
                            >
                              <div className="flex w-full flex-row items-center justify-between">
                                <div className="flex flex-row items-center">
                                  <p className="mr-2 flex items-center justify-center rounded-full bg-slate-200 p-1 px-2 text-xs text-slate-600">
                                    {rider.deliveryCount} Delivered
                                  </p>
                                  {rider.label}{" "}
                                  {rider.isOngoing && `(in ${rider.barangay})`}
                                </div>
                                <div
                                  className={`rounded-xl p-1 px-2 text-xs text-white ${rider.isOngoing ? "bg-blue-500" : "bg-green-500"}`}
                                >
                                  {rider.isOngoing ? "Ongoing" : "Available"}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage className="absolute -bottom-4" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AssignRider;
