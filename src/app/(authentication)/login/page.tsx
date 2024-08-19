import { getSession } from "@/lib/session";
import { LoginCard } from "./_components/login-card";
import { redirect, useRouter } from "next/navigation";

const Page = () => {
    // const session = getSession()
    // if(session?.role) {
    //   redirect(`/${session?.role}`)
    // }
    return (<LoginCard/>);
}
 
export default Page;