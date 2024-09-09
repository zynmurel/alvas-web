'use client'
import Link from "next/link"
import {
    ArrowUpRight,
    LoaderCircle,
    PhilippinePeso,
    ShoppingCart,
    Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { api } from "@/trpc/react"
import { formatCurrency } from "@/app/_utils/format"
import { format } from "date-fns"
import Loading from "./_components/table-components/loading"
import NoFound from "./_components/table-components/no-found"

const Page = () => {
    const { data, isPending } = api.dashboard.dashboardData.useQuery()
    return (
        <div className=" flex flex-col">
            <div className="mx-auto grid w-full max-w-7xl gap-2">
                <h1 className="text-3xl font-semibold">Dashboard</h1>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8">
                    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                        <Card x-chunk="dashboard-01-chunk-0">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Sales this Month
                                </CardTitle>
                                <PhilippinePeso className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{isPending ? <LoaderCircle size={30} className=" animate-spin text-gray-400" /> : formatCurrency(data?.salesThisMonth || 0)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total sales for the month of {format(new Date(), "MMMM")}
                                </p>
                            </CardContent>
                        </Card>
                        <Card x-chunk="dashboard-01-chunk-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Customers
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{isPending ? <LoaderCircle size={30} className=" animate-spin text-gray-400" /> : data?.totalUsers}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total registered users in your store.
                                </p>
                            </CardContent>
                        </Card>
                        <Card x-chunk="dashboard-01-chunk-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Products
                                </CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{isPending ? <LoaderCircle size={30} className=" animate-spin text-gray-400" /> : data?.totalProducts}</div>
                                <p className="text-xs text-muted-foreground">
                                    Number of products available.
                                </p>
                            </CardContent>
                        </Card>
                        <Card x-chunk="dashboard-01-chunk-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Overall Sales</CardTitle>
                                <PhilippinePeso className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{isPending ? <LoaderCircle size={30} className=" animate-spin text-gray-400" /> : formatCurrency(data?.overAllSales || 0)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total of your overall sale.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
                        <Card
                            className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
                        >
                            <CardHeader className="flex flex-row items-center">
                                <div className="grid gap-2">
                                    <CardTitle>Delivery Orders</CardTitle>
                                    <CardDescription>
                                        Recent orders from your store.
                                    </CardDescription>
                                </div>
                                <Button asChild size="sm" className="ml-auto gap-1">
                                    <Link href="/admin/orders">
                                        Manage
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Customer</TableHead>
                                            <TableHead className="">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            data?.preShowOrders.map((order) => {
                                                return (
                                                    <TableRow key={order.id}>
                                                        <TableCell>
                                                            <div className="font-medium capitalize">{order.customer}</div>
                                                            <div className="hidden text-sm text-muted-foreground md:inline">
                                                                {order.contact}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className="text-xs capitalize" variant={
                                                                order.status === "PENDING" ? "outline" : order.status === "ONGOING" ? "outline" : order.status === "CANCELLED" ? "destructive" : "default"
                                                            }>
                                                                {order.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">{formatCurrency(order.total_amount || 0)}</TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                                    {isPending && <Loading />}
                                    {!isPending && !data?.preShowOrders?.length && <NoFound />}
                            </CardContent>
                        </Card>
                        <Card
                            className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
                        >
                            <CardHeader className="flex flex-row items-center">
                                <div className="grid gap-2">
                                    <CardTitle>Transactions</CardTitle>
                                    <CardDescription>
                                        Recent transactions made from your store.
                                    </CardDescription>
                                </div>
                                <Button asChild size="sm" className="ml-auto gap-1">
                                    <Link href="/admin/transaction">
                                        View all
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Processed By</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            data?.preShowTransactions.map((trans) => {
                                                return (
                                                    <TableRow key={trans.id}>
                                                        <TableCell>
                                                            <div className="font-medium">{trans.proccessed_by}</div>
                                                            <div className="text-sm text-muted-foreground inline capitalize">
                                                                {trans.type.toLowerCase()}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">{formatCurrency(trans.total_amount)}</TableCell>
                                                    </TableRow>)
                                            })
                                        }
                                    </TableBody>
                                </Table>
                                    {isPending && <Loading />}
                                    {!isPending && !data?.preShowTransactions?.length && <NoFound />}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Page;
