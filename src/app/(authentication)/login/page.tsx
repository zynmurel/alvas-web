'use client'
import { api } from "@/trpc/react";
import { LoginCard } from "./_components/login-card";
import { Mail, Phone } from "lucide-react";

const Page = () => {
  
    const { data: settings } = api.global.getSettings.useQuery()
    return (
        <div className=" grid lg:grid-cols-2 w-full">
            <div className=" flex justify-center items-center"><LoginCard/>
            </div>
            <div className=" bg-muted flex items-center justify-center">
                <div className=" px-5 md:px-20 xl:px-32 flex items-center justify-center flex-col">
                <img src="/images/logo.png" alt="logo" className=" w-[200px] lg:w-[300px] xl:w-[400px]"/>
                <p className=" text-xl md:text-2xl">Easily manage your orders and data with Alvas App. Access real-time insights, track every transaction, and simplify your workflow, all in one convenient and intuitive platform.</p>
                {
                    !!settings && 
                    <div className=" flex flex-row gap-5 text-base mt-3 justify-end w-full text-muted-foreground">
                        <p className=" flex flex-row gap-1 items-center"><Phone className=" w-4"/>{settings.contact_number}</p>
                        <p className=" flex flex-row gap-1 items-center"><Mail className=" w-4"/>{settings.email_address}</p>
                    </div>
                }
                </div>
            </div>
        </div>);
}
 
export default Page;