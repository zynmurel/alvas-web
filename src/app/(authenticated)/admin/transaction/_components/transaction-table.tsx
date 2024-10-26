import { formatCurrency } from "@/app/_utils/format"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
type Transactions = {
    id: number;
    total_amount: number;
    transact_by: {
        id: number;
        admin_id: number;
        username: string;
        password: string;
        first_name: string;
        middle_name: string;
        last_name: string;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    transact_by_type: string;
    transaction_type :string;
}[] | undefined

export default function TransactionTable({transactions}:{transactions:Transactions}) {
  return (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Processed by</TableHead>
            <TableHead className="">Transaction Type</TableHead>
            <TableHead className="">Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className=" flex flex-col items-start">
                <p className=" text-gray-500 text-xs -mb-1">{transaction.transact_by_type}</p>
                {`${transaction.transact_by?.first_name} ${transaction.transact_by?.middle_name[0]}. ${transaction.transact_by?.last_name}`}
              </TableCell>
              <TableCell className="">{transaction.transaction_type=== "DELIVERY" ? "Delivery" : 
                transaction.transaction_type === "DINE_IN" ? "Dine In" : ""}</TableCell>
              <TableCell className="">{formatCurrency(transaction.total_amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}