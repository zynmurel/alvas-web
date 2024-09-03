'use client'
import { useParams } from "next/navigation";

const Layout = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {
    const { id } = useParams()
    const isUpdate = id !== "new"
    return ( 
        <div className=" flex flex-col">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">{isUpdate ? "Update" :"Create"} Product</h1>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main> 
            </div>
        </div>
        );
}
 
export default Layout;