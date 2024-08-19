'use client'
import Link from "next/link"
import { Menu, Package2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"

const paths = [
    {
        title : "Dashboard",
        path : '/admin',
    },
    {
        title : "Orders",
        path : '/admin/orders',
    },
    {
        title : "Products",
        path : '/admin/products',
    },
    {
        title : "Customers",
        path : '/admin/customers',
    },
    {
        title : "Staffs",
        path : '/admin/staffs',
    },
    {
        title : "Settings",
        path : '/admin/settings',
    }
]

const AdminNavigation = () => {
    const pathname = usePathname()
    return (  
        <div>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {
            paths.map((path, index)=>(
                <Link
                key={index}
                  href={path.path}
                  className={`${path.path !== pathname && 'text-muted-foreground '} transition-colors hover:text-foreground`}
                >
                  {path.title}
                </Link>
                ))
          }
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Orders
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link href="#" className="hover:text-foreground">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        </div>);
}
 
export default AdminNavigation;