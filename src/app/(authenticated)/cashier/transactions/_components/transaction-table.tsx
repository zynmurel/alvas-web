import { formatCurrency } from "@/app/_utils/format"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns";
import { type TransactionType } from "../page";
type Transactions = TransactionType[] | undefined

export default function TransactionTable({transactions, setSelectedTransaction, selectedTransaction}:{
  transactions:Transactions;
  setSelectedTransaction: React.Dispatch<React.SetStateAction<TransactionType | undefined>>
  selectedTransaction : TransactionType | undefined
}) {
  const overAllTotal = transactions?.reduce((curr, arr)=>{
    return curr + arr.total_amount
  },0)
  return (
    <div className="p-2 md:px-3">
      <div className=" flex flexrow justify-between mb-1">
      <p className=" p-1 font-semibold">Transactions match this filter ({transactions?.length || 0})</p>
      <p className=" p-1 font-semibold">Total : {formatCurrency(overAllTotal || 0)}</p>
      </div>
      <Table className=" border rounded-lg">
        <TableHeader className=" bg-muted">
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead className="">Date & Time</TableHead>
            <TableHead className="">Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow onClick={()=>setSelectedTransaction(transaction)} key={transaction.id} className={`cursor-pointer hover:bg-muted ${selectedTransaction?.id === transaction.id && "bg-muted"}`}>
              <TableCell className=" flex flex-col items-start">
              {transaction.id}
              </TableCell>
              <TableCell className="">{format(transaction.createdAt, "PPP p")}</TableCell>
              <TableCell className="">{formatCurrency(transaction.total_amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}