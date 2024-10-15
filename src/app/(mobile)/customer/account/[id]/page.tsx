'use client'
import React from "react"
import {
    Card,
} from "@/components/ui/card"
import { api } from "@/trpc/react"
import Loading from "../_components/loading"
import { useState } from "react"
import { useParams } from "next/navigation"
import { type delivery_rider, type orders, type products, type transaction } from "@prisma/client"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const UpdateCustomerSchema = z.object({
    first_name: z.string(),
    middle_name: z.string(),
    last_name: z.string(),
    contact_number: z.string(),
    address: z.string(),
    place_description: z.string(),
})
const UpdateUsernameSchema = z.object({
    username: z.string(),
})

const UpdatePasswordSchema = z.object({
    password: z.string(),
    newPassword: z.string().min(8, { message: "password must contain 8 characters" }),
    confirmPassword: z.string().min(8, { message: "password must contain 8 characters" }),
}).refine((data) => data.confirmPassword === data.newPassword, {
    message: "Passwords does not match",
    path: ["confirmPassword"]
})

export type TransactionType = (transaction & {
    orders: (orders & { product: products })[],
    rider: delivery_rider | null
})

const Page = () => {
    const { id } = useParams()
    const [isEditPersonalDetails, setIsEditPersonalDetails] = useState(false)
    const [isEditUsernameDetails, setIsEditUsernameDetails] = useState(false)
    const [isEditPasswordDetails, setIsEditPasswordDetails] = useState(false)
    const { data: account, isLoading: accountIsLoading, refetch } = api.user_customer.account.getAccountDetails.useQuery({
        id: Number(id)
    }, {
        enabled: !Number.isNaN(Number(id))
    })
    const { mutateAsync, isPending } = api.user_customer.account.updateCustomerInformation.useMutation({
        onSuccess: async () => {
            toast({
                title: "Updated",
                description: "Details Updated"
            })
            setIsEditPersonalDetails(false)
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
    const { mutateAsync: updateUsername, isPending: isPendingUsername } = api.user_customer.account.updateCustomerUsername.useMutation({
        onSuccess: async () => {
            toast({
                title: "Updated",
                description: "Username Updated"
            })
            setIsEditPersonalDetails(false)
            await refetch()
        },
        onError: (e: any) => {
            if (e.message.includes("Unique constraint failed on the fields")) {
                toast({
                    variant: "destructive",
                    title: "Update failed",
                    description: "Username already exist."
                })
                form2.setError("username", { message: "Username already used." })
            } else {
                toast({
                    variant: "destructive",
                    title: "Update failed",
                    description: e.message
                })
            }
        }
    })
    const { mutateAsync: updatePassword, isPending: isPendingPassword } = api.user_customer.account.updateCustomerPassword.useMutation({
        onSuccess: async () => {
            toast({
                title: "Updated",
                description: "Password Updated"
            })
            setIsEditPasswordDetails(false)
            form3.reset()
            await refetch()
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Update failed",
                description: "Wrong password"
            })
            form3.setError("password", { message: "Wrong password." })
        }
    })
    const form = useForm<z.infer<typeof UpdateCustomerSchema>>({
        resolver: zodResolver(UpdateCustomerSchema),
        values: !!account ? {
            first_name: account.first_name,
            middle_name: account.middle_name,
            last_name: account.last_name,
            contact_number: account.contact_number || "",
            address: account.address || "",
            place_description: account.place_description || "",
        } : undefined
    })
    const form2 = useForm<z.infer<typeof UpdateUsernameSchema>>({
        resolver: zodResolver(UpdateUsernameSchema),
        values: !!account ? {
            username: account.username,
        } : undefined
    })
    const form3 = useForm<z.infer<typeof UpdatePasswordSchema>>({
        resolver: zodResolver(UpdatePasswordSchema),
    })

    const onCancel = () => {
        setIsEditPersonalDetails(false)
        form.clearErrors()
        account && form.reset({
            first_name: account.first_name,
            middle_name: account.middle_name,
            last_name: account.last_name,
            contact_number: account.contact_number || "",
            address: account.address || "",
            place_description: account.place_description || "",
        })
    }

    const onCancel2 = () => {
        setIsEditUsernameDetails(false)
        form2.clearErrors()
        account && form2.reset({
            username: account.username,
        })
    }

    const onCancel3 = () => {
        setIsEditPasswordDetails(false)
        form3.clearErrors()
        account && form3.reset()
    }

    const onSubmit = async (data: z.infer<typeof UpdateCustomerSchema>) => {
        if (id) {
            await mutateAsync({
                id: Number(id),
                ...data
            })
        } else {
            throw new Error("User not found")
        }
    }

    const onSubmit2 = async (data: z.infer<typeof UpdateUsernameSchema>) => {
        if (id) {
            await updateUsername({
                id: Number(id),
                ...data
            })
        } else {
            throw new Error("User not found")
        }
    }

    const onSubmit3 = async (data: z.infer<typeof UpdatePasswordSchema>) => {
        if (id) {
            await updatePassword({
                id: Number(id),
                ...data
            })
        } else {
            throw new Error("User not found")
        }
    }

    return (

        <div className="mx-auto grid w-full p-2">
            <div className="flex flex-row justify-between">
                <div>
                    <h1 className="text-base font-bold">Account Settings</h1>
                    <p className="text-muted-foreground text-xs">Modify your account information and settings.</p>
                </div>
                <div>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 md:gap-8">
                <Card x-chunk="dashboard-01-chunk-0" className=" mt-2 space-y-3 shadow-none overflow-scroll border-none rounded" style={{ maxHeight: "90vh" }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full">
                            <div className="rounded border shadow-sm pb-3 relative text-sm">
                                {(accountIsLoading || isPending) &&
                                    <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                                        <Loading />
                                    </div>}
                                <div className=" font-bold bg-slate-800 text-white text-sm p-2 rounded-t flex flex-row justify-between">
                                    <div>Personal Details</div>
                                    {
                                        !isEditPersonalDetails ?
                                            <div onClick={() => setIsEditPersonalDetails(true)} className=" bg-white text-slate-800 font-semibold flex items-center justify-center flex-row gap-1 px-1 rounded text-xs">
                                                <Edit size={12} strokeWidth={3} />Edit
                                            </div> : <></>


                                    }
                                </div>
                                <div className=" flex flex-col  p-2  space-y-3 px-3">

                                    <FormField
                                        control={form.control}
                                        disabled={!isEditPersonalDetails}
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem className=" relative">
                                                <FormLabel className="">First Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Input first name" className=" text-xs" style={{ marginTop: 0 }} />
                                                </FormControl>
                                                <FormMessage className=" absolute -bottom-5" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        disabled={!isEditPersonalDetails}
                                        name="middle_name"
                                        render={({ field }) => (
                                            <FormItem className=" relative">
                                                <FormLabel className="">Middle Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Input middle name" className=" text-xs" style={{ marginTop: 0 }} />
                                                </FormControl>
                                                <FormMessage className=" absolute -bottom-5" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        disabled={!isEditPersonalDetails}
                                        name="last_name"
                                        render={({ field }) => (
                                            <FormItem className=" relative">
                                                <FormLabel className="">Last Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Input last name" className=" text-xs" style={{ marginTop: 0 }} />
                                                </FormControl>
                                                <FormMessage className=" absolute -bottom-5" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        disabled={!isEditPersonalDetails}
                                        name="contact_number"
                                        render={({ field }) => (
                                            <FormItem className=" relative">
                                                <FormLabel className="">Contact No.</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Input contact number" className=" text-xs" style={{ marginTop: 0 }} />
                                                </FormControl>
                                                <FormMessage className=" absolute -bottom-5" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        disabled={!isEditPersonalDetails}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem className=" relative">
                                                <FormLabel className="">Address</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Input address" className=" text-xs" style={{ marginTop: 0 }} />
                                                </FormControl>
                                                <FormMessage className=" absolute -bottom-5" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        disabled={!isEditPersonalDetails}
                                        name="place_description"
                                        render={({ field }) => (
                                            <FormItem className=" relative">
                                                <FormLabel className="">Place description of your address</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} placeholder="Input place description" className=" text-xs" style={{ marginTop: 0 }} />
                                                </FormControl>
                                                <FormMessage className=" absolute -bottom-5" />
                                            </FormItem>
                                        )}
                                    />
                                    {
                                        !isEditPersonalDetails ?
                                            <></> :
                                            <div className=" flex flex-row justify-end w-full gap-1">
                                                <Button onClick={onCancel} size={"sm"} variant={"outline"} className=" flex flex-row gap-1 items-center" type="button">
                                                    Cancel
                                                </Button>
                                                <Button size={"sm"} className="  flex flex-row gap-1 items-center">
                                                    Save
                                                </Button>
                                            </div>


                                    }
                                </div>
                            </div>
                        </form>
                    </Form>
                    <Form {...form2}>
                        <form onSubmit={form2.handleSubmit(onSubmit2)} className="flex flex-col w-full">
                            <div className="rounded border shadow-sm pb-3 relative text-sm">
                                {(accountIsLoading || isPendingUsername) &&
                                    <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                                        <Loading />
                                    </div>}
                                <div className=" font-bold bg-slate-800 text-white text-sm p-2 rounded-t flex flex-row justify-between">
                                    <div>Username</div>
                                    {
                                        !isEditUsernameDetails ?
                                            <div onClick={() => setIsEditUsernameDetails(true)} className=" bg-white text-slate-800 font-semibold flex items-center justify-center flex-row gap-1 px-1 rounded text-xs">
                                                <Edit size={12} strokeWidth={3} />Edit
                                            </div> : <></>


                                    }
                                </div>
                                <div className=" flex flex-col  p-2  space-y-3 px-3">

                                    <FormField
                                        control={form2.control}
                                        disabled={!isEditUsernameDetails}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem className=" relative">
                                                <FormLabel className="">Username</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Input username" className=" text-xs" style={{ marginTop: 0 }} />
                                                </FormControl>
                                                <FormMessage className=" absolute -bottom-5" />
                                            </FormItem>
                                        )}
                                    />
                                    {
                                        !isEditUsernameDetails ?
                                            <></> :
                                            <div className=" flex flex-row justify-end w-full gap-1">
                                                <Button onClick={onCancel2} size={"sm"} variant={"outline"} className=" flex flex-row gap-1 items-center" type="button">
                                                    Cancel
                                                </Button>
                                                <Button size={"sm"} className="  flex flex-row gap-1 items-center">
                                                    Save
                                                </Button>
                                            </div>
                                    }
                                </div>
                            </div>
                        </form>
                    </Form>
                    <Form {...form3}>
                        <form onSubmit={form3.handleSubmit(onSubmit3)} className="flex flex-col w-full">
                            <div className="rounded border shadow-sm pb-3 relative text-sm">
                                {(accountIsLoading || isPendingPassword) &&
                                    <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                                        <Loading />
                                    </div>}
                                <div className=" font-bold bg-slate-800 text-white text-sm p-2 rounded-t flex flex-row justify-between">
                                    <div>Change Password</div>
                                </div>
                                {
                                    !isEditPasswordDetails ?
                                        <div className=" w-full flex items-center justify-center p-5">
                                            <Button size={"sm"} type="button" variant={"outline"} onClick={() => setIsEditPasswordDetails(true)}>
                                                <Edit size={15} />Change Password
                                            </Button>
                                        </div> :
                                        <div className=" flex flex-col  p-2  space-y-3 px-3">

                                            <FormField
                                                control={form3.control}
                                                disabled={!isEditPasswordDetails}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem className=" relative">
                                                        <FormLabel className="">Current Password</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" {...field} placeholder="Input password" className=" text-xs" style={{ marginTop: 0 }} />
                                                        </FormControl>
                                                        <FormMessage className=" absolute -bottom-5" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form3.control}
                                                disabled={!isEditPasswordDetails}
                                                name="newPassword"
                                                render={({ field }) => (
                                                    <FormItem className=" relative">
                                                        <FormLabel className="">New Password</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" {...field} placeholder="Input password" className=" text-xs" style={{ marginTop: 0 }} />
                                                        </FormControl>
                                                        <FormMessage className=" absolute -bottom-5" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form3.control}
                                                disabled={!isEditPasswordDetails}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <FormItem className=" relative">
                                                        <FormLabel className="">Confirm Password</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" {...field} placeholder="Input password" className=" text-xs" style={{ marginTop: 0 }} />
                                                        </FormControl>
                                                        <FormMessage className=" absolute -bottom-5" />
                                                    </FormItem>
                                                )}
                                            />
                                            {
                                                !isEditPasswordDetails ?
                                                    <></> :
                                                    <div className=" flex flex-row justify-end w-full gap-1">
                                                        <Button onClick={onCancel3} size={"sm"} variant={"outline"} className=" flex flex-row gap-1 items-center" type="button">
                                                            Cancel
                                                        </Button>
                                                        <Button size={"sm"} className="  flex flex-row gap-1 items-center">
                                                            Save
                                                        </Button>
                                                    </div>
                                            }
                                        </div>


                                }
                            </div>
                        </form>
                    </Form>
                    <div className=" pb-20"></div>
                </Card>
            </div>
        </div>
    );
}

export default Page;