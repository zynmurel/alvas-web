const Layout = ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {


    return (
            <div className=" flex flex-col">
                <div className="mx-auto grid w-full p-2">
                    <h1 className="text-xl font-bold">Place your order</h1>
                    <p className="text-muted-foreground text-sm">Select products and fulfill your orders.</p>
                    <div className="flex flex-1 flex-col gap-4 md:gap-8">
                        {children}
                    </div>
                </div>
            </div>
    );
}

export default Layout;