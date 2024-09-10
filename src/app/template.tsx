'use client'

import { Toaster } from "@/components/ui/toaster"

const Template = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {
    return ( <><Toaster />{children}</> );
}
 
export default Template;