'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    name: "Information",
    path: "/admin/settings"
  },
  // {
  //     name : "Account",
  //     path: "/admin/settings/account"
  // },
  {
    name: "Advance",
    path: "/admin/settings/advance"
  }
]

const Layout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const path = usePathname()
  return (
    <div className=" flex flex-col">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Staffs</h1>
        <div className="px-6 py-2 space-y-5 lg:px-10 lg:container">
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <nav
              className="grid gap-4 text-base text-muted-foreground" x-chunk="dashboard-04-chunk-0"
            >
              {
                routes.map((route) => {
                  return <Link className={path === route.path ? "font-semibold text-primary" : ""} key={route.path} href={route.path}>{route.name}</Link>
                })
              }
            </nav>
            {children}
          </div>
        </div>
      </div>
    </div>);
}

export default Layout;