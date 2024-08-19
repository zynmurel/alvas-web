import { getSession } from "@/lib/session";
import { redirect } from 'next/navigation';

const AuthenticatedLayout = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {  
    const session = getSession()
    if(!session) {
      redirect("/login")
    }
    return ( 
        <div>{children}</div>
     );
}
 
export default AuthenticatedLayout;