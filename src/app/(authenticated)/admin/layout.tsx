
import UserProfile from "./_components/user"
import AdminNavigation from "./_components/navigation"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { ModeToggle } from "@/app/_components/theme-mode"

export default function Dashboard({
    children,
  }: Readonly<{ children: React.ReactNode }>) {
    const session = getSession()
    // if(session?.role!=="admin") {
    //   redirect(`/${session?.role}`)
    // }
  return (
    <div className="flex min-h-screen w-full flex-col ">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between z-30">
        <AdminNavigation/>
        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <ModeToggle/>
            <UserProfile/>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/60 p-4 md:gap-8 md:p-10">
        <div className="lg:mx-20 xl:mx-40">{children}</div>
      </main>
    </div>
  )
}
