'use client'
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { useStore } from "@/lib/store/app";
import { toast } from "@/components/ui/use-toast";

const CreateCashier = z.object({
    // admin_id     Int
    username: z.string().min(8, { message: "Username should be atleast 8 characters." }),
    // password     String
    first_name: z.string(),
    middle_name: z.string(),
    last_name: z.string(),
})

const FormCashier = () => {
    const { id } = useParams()
    const { user } = useStore()
    const router = useRouter()
    const form = useForm<z.infer<typeof CreateCashier>>({
        resolver: zodResolver(CreateCashier),
        //   defaultValues: {}
    })

    const { data: cashier, isLoading: cashierIsLoading } = api.cashier.getCashier.useQuery({
        id: Number(id)
    }, {
        enabled: id !== "new"
    })
    const { refetch } = api.cashier.getAllCashier.useQuery() 

    const { mutateAsync:createCashier, isPending:createCashierPending } = api.cashier.createCashier.useMutation({
        onSuccess:async()=>{
            toast({
                title:"Success!",
                description:id === "new" ? "Cashier added successfully!":"Cashier updated successfully!"
            })
            await refetch()
            router.push("/admin/staffs")
        },
        onError : (e) =>{
        if(e.message.includes("Unique constraint failed on the fields")){
            toast({
                variant:"destructive",
                title:"Failed",
                description:"Username already used."
              })
            form.setError("username", { message : "Username already used."})
        }else{
            toast({
              variant:"destructive",
              title:"Failed",
              description:e.message
            })
        }
        }
    })

    const onSubmitProduct = async (data: z.infer<typeof CreateCashier>) => {
        if(user?.id){
            await createCashier({
                id: id === "new" ? undefined : Number(id),
                admin_id : user.id ,
                ...data
            })
        }else {
            throw new Error("No Admin Found")
        }
    }

    useEffect(() => {
        if (cashier) {
            form.setValue("username", cashier.username)
            form.setValue("first_name", cashier.first_name)
            form.setValue("middle_name", cashier.middle_name)
            form.setValue("last_name", cashier.last_name)
        }
    }, [form, cashier])

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitProduct)} className="flex flex-col w-full space-y-6 p-5 sm:px-10 border rounded-lg shadow-md">
                <div className="w-full space-y-6">
                    <h1 className="font-semibold text-xl">{id !== "new" ? "Update Cashier" : "Create Cashier"}</h1>

                    <div className=" grid sm:grid-cols-2 gap-5">
                        <FormField
                            disabled={cashierIsLoading}
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Input first name" />
                                    </FormControl>
                                    <FormDescription>
                                        This is for the first name of the cashier.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={cashierIsLoading}
                            control={form.control}
                            name="middle_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Middle Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Input middle name" />
                                    </FormControl>
                                    <FormDescription>
                                        This is for the middle name of the cashier.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={cashierIsLoading}
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Input last name" />
                                    </FormControl>
                                    <FormDescription>
                                        This is for the last name of the cashier.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={cashierIsLoading}
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Input username" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is for the username of the cashier to use as credential.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className=" flex flex-col gap-5 sm:flex-row w-full justify-between items-end">
                <div className=" text-xs text-orange-400"><span className=" font-semibold">Note:</span> Passwords are auto-generated based on the default password set in admin settings.</div>
                <Button type="submit" disabled={createCashierPending || cashierIsLoading} className="self-end ">{"Submit Cashier"}</Button>
                </div>
            </form>
        </Form>
    );
}

export default FormCashier;