import { formatCurrency } from "@/app/_utils/format"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { $Enums, delivery_rider, orders, settings, transaction } from "@prisma/client"
import { format } from "date-fns"
import { TransactionType } from "../page"
import { Dispatch, SetStateAction } from "react"
import { BadgeStatus } from "../../../basket/_components/badger"
export default function CancelledTable({ transactions, setSelectedTransaction,settings }: { 
    transactions: TransactionType[] | null | undefined; 
    settings: settings | null | undefined
    setSelectedTransaction: Dispatch<SetStateAction<TransactionType | undefined>> }) {
    return (
        <div>
            <div className=" font-bold my-2">Cancelled Transactions</div>
            <Table className=" text-sm border">
                <TableHeader className=" bg-slate-700 rounded-t-xl overflow-hidden text-white">
                    <TableRow>
                        <TableHead className=" text-white">Date & Time</TableHead>
                        <TableHead className=" text-white">Status</TableHead>
                        <TableHead className="text-right text-white">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions?.map((transaction) => (
                        <TableRow onClick={() => setSelectedTransaction(transaction)} key={transaction.id} className=" py-5">
                            <TableCell className="font-medium">{format(transaction.createdAt, "P hh:mm aa")}</TableCell>
                            <TableCell className=" text-xs"><BadgeStatus status={transaction.status} /></TableCell>
                            <TableCell className="text-right">{formatCurrency(transaction.total_amount + (settings?.delivery_fee||0))}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
