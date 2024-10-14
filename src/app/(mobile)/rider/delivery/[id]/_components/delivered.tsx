'use client'
import { api } from "@/trpc/react";
import Loading from "../../_components/loading";

const Delivered = () => {
    const { data: settings, isLoading: settingsIsLoading } = api.user_customer.settings.getSettings.useQuery()
    return ( <div className=" relative rounded overflow-y-auto min-h-[300px] bg-white w-full grid mt-1" style={{ maxHeight: "80vh" }}>
        {(true) &&
            <div className=" absolute bg-background opacity-50 z-10 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <Loading />
            </div>}
        <div className=" flex flex-col gap-2 overflow-hidden">
        </div>
    </div> );
}
 
export default Delivered;