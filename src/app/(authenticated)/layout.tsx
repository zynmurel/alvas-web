import { getSession } from "@/lib/session";
import { redirect } from 'next/navigation';
import { ThemeProvider } from "../_components/theme-provider";

const AuthenticatedLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = getSession()
  if (!session) {
    redirect("/login")
  }
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div>{children}</div>
    </ThemeProvider>
  );
}

export default AuthenticatedLayout;