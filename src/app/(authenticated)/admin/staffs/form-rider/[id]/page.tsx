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
import { isMobileNumber, onlyString } from "@/app/helper/regex";

const CreateRider = z.object({
    // admin_id     Int
    username: z.string().min(8, { message: "Username should be atleast 8 characters." }),
    // password     String
    first_name: onlyString,
    middle_name: onlyString,
    last_name: onlyString,
    contact_number: isMobileNumber,
})

const FormRider = () => {
    const { id } = useParams()
    const { user } = useStore()
    const router = useRouter()
    const form = useForm<z.infer<typeof CreateRider>>({
        resolver: zodResolver(CreateRider),
        //   defaultValues: {}
    })
    const { refetch } = api.rider.getAllRider.useQuery() 

    const { data: rider, isLoading: riderIsLoading } = api.rider.getRider.useQuery({
        id: Number(id)
    }, {
        enabled: id !== "new"
    })

    const { mutateAsync:createRider, isPending:createRiderPending } = api.rider.createRider.useMutation({
        onSuccess:async ()=>{
            toast({
                title:"Success!",
                description:id === "new" ? "Rider added successfully!":"Rider updated successfully!"
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

    const onSubmitProduct = async (data: z.infer<typeof CreateRider>) => {
        if(user?.id){
            await createRider({
                id: id === "new" ? undefined : Number(id),
                admin_id : user.id ,
                ...data
            })
        }else {
            throw new Error("No Admin Found")
        }
    }

    useEffect(() => {
        if (rider) {
            form.setValue("username", rider.username)
            form.setValue("first_name", rider.first_name)
            form.setValue("middle_name", rider.middle_name)
            form.setValue("last_name", rider.last_name)
            form.setValue("contact_number", rider.contact_number)
        }
    }, [form, rider])

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitProduct)} className="flex flex-col w-full space-y-6 p-5 sm:px-10 border rounded-lg shadow-md">
                <div className="w-full space-y-6">
                    <h1 className="font-semibold text-xl">{id !== "new" ? "Update Rider" : "Create Rider"}</h1>

                    <div className=" grid sm:grid-cols-2 gap-5">
                        <FormField
                            disabled={riderIsLoading}
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Input first name" />
                                    </FormControl>
                                    <FormDescription>
                                        This is for the first name of the rider.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={riderIsLoading}
                            control={form.control}
                            name="middle_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Middle Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Input middle name" />
                                    </FormControl>
                                    <FormDescription>
                                        This is for the middle name of the rider.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={riderIsLoading}
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Input last name" />
                                    </FormControl>
                                    <FormDescription>
                                        This is for the last name of the rider.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={riderIsLoading}
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Input username" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is for the username of the rider to use as credential.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={riderIsLoading}
                            control={form.control}
                            name="contact_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Contact Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Input contact number" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is for the contact number of the rider to use as credential.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className=" flex flex-col gap-5 sm:flex-row w-full justify-between items-end">
                <div className=" text-xs text-orange-400"><span className=" font-semibold">Note:</span> Passwords are auto-generated based on the default password set in admin settings.</div>
                <Button type="submit" disabled={createRiderPending || riderIsLoading} className="self-end ">{"Submit Rider"}</Button>
                </div>
            </form>
        </Form>
    );
}

export default FormRider;