'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Dispatch, type SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const UpsertBarangaySchema = z.object({
  barangay_name: z.string().min(2, { message: "Barangay should be atleast 2 characters." }),
  barangay_id: z.number(),
  barangay_delivery_fee: z.coerce.number().min(0),
})
export default function UpsertBarangay({ open, setOpen }: { open: undefined | number; setOpen: Dispatch<SetStateAction<number | undefined>> }) {

  const { data: barangays, isPending: barangaayIsPending, refetch } = api.user_customer.account.getBarangays.useQuery(undefined, { enabled: false })

  const isUpdate = barangays?.find((brgy) => brgy.value === open)

  const { mutateAsync: updateDeliveryFee, isPending: updateDeliveryFeeIsPending } = api.settings.upsertBarangay.useMutation({
    onSuccess: async() => {
      setOpen(undefined)
      form.reset()
      await refetch()
      toast({
          title : "Success",
          description : isUpdate?"Barangay Updated" : "Barangay Created"
      })
    }
  })
  const form = useForm<z.infer<typeof UpsertBarangaySchema>>({
    resolver: zodResolver(UpsertBarangaySchema),
    values: isUpdate && !!open ? {
      barangay_name: isUpdate.label,
      barangay_id: open,
      barangay_delivery_fee: isUpdate.delivery_fee,
    } : {
      barangay_name: "",
      barangay_id: 0,
      barangay_delivery_fee: 0,
    }
  })

  const onSubmitBarangay = async (data: z.infer<typeof UpsertBarangaySchema>) => {
    console.log(data)
    if (!Number.isNaN(Number(open?.toString()))) {
      await updateDeliveryFee({
        barangay_id: Number(open),
        barangay_name: data.barangay_name,
        barangay_delivery_fee: data.barangay_delivery_fee,
      })
    } else {
      throw new Error("No Admin Found")
    }
  }

  return (
    <Dialog open={open !== undefined} onOpenChange={() => {
      setOpen(undefined)
      form.reset()
      }}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{!isUpdate ? "Create Barangay" : "Edit Barangay"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitBarangay)} className=" w-full flex flex-col space-y-6 sm:px-5">
            <div className="w-full space-y-6">

                <FormField
                  control={form.control}
                  name="barangay_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">Barangay</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Input barangay name" />
                      </FormControl>
                      <FormDescription>
                        This is for the  name of the barangay.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="barangay_delivery_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">{"Barangay's Delivery fee"}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="Input delivery fee" />
                      </FormControl>
                      <FormDescription>
                        This is for the delivery fee for this barangay.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <div className=" flex flex-col gap-5 sm:flex-row w-full justify-between">
              <div></div>
              <Button type="submit" disabled={barangaayIsPending || updateDeliveryFeeIsPending} className="self-end ">{"Save"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
