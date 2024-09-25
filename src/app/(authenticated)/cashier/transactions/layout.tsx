const Layout = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {
    return ( <div className=" flex flex-col">
        <div className="mx-auto grid w-full max-w-9xl gap-2">
            <h1 className="text-3xl font-semibold">Transactions</h1>
            <p className="text-muted-foreground -mt-2 mb-2">Your transaction history.</p>
            <div className="flex flex-1 flex-col gap-4 md:gap-8">
                {children}
            </div>
        </div>
    </div> );
}
 
export default Layout;