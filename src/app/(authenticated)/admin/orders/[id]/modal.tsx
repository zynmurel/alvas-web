
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Transaction } from "../page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeStatus } from "@/app/(mobile)/customer/basket/_components/badger";
import { format } from "date-fns-tz";
import { timeDate, timeZone } from "@/app/helper/format";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/app/_utils/format";
const OpenShowTransaction = ({ transaction, setTransaction }: {
  transaction: Transaction | undefined;
  setTransaction: React.Dispatch<React.SetStateAction<Transaction | undefined>>;
}) => {
  if (!transaction) {
    return <></>
  }
  const boholTimeDate = timeDate(transaction.createdAt)
  return (
    <Dialog open={!!transaction} onOpenChange={() => setTransaction(undefined)}>
      <DialogContent className="">
        <Card
          className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
        >
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5 w-full">
              <CardTitle className=" flex items-center gap-2 text-lg w-full justify-between">
                Order <BadgeStatus status={transaction.status} />
              </CardTitle>
              <CardDescription>Date: {format(boholTimeDate, "PPP", { timeZone: timeZone })}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm pt-2">
            <div className="grid gap-3">
              <div className="font-semibold">Order Details</div>
              <ul className="grid gap-3 max-h-40 overflow-auto">
                {
                  transaction.transactions.map((transact, index) => {
                    return <div key={index}>
                      <div className=" flex flex-row justify-between font-bold">
                      <div>Transaction {index + 1}</div>
                      <div className=" font-normal text-slate-500">{format(transact.createdAt, "P hh:mm aa")}</div>
                      </div>
                      {
                        transact?.orders.map((order, index) => (
                          <li className="flex items-center justify-between" key={index}>
                            <span className="text-muted-foreground">
                              {order.product.product_name} x <span>{order.quantity}</span>
                            </span>
                            <span>{formatCurrency(order.product.amount)}</span>
                          </li>
                        ))
                      }
                    </div>
                  })
                }
              </ul>
              <Separator className="my-2" />
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(transaction.sub_total)}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{formatCurrency(transaction.delivery_fee)}</span>
                </li>
                <li className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Total</span>
                  <span>{formatCurrency(transaction.sub_total + transaction.delivery_fee)}</span>
                </li>
              </ul>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Customer Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Customer</dt>
                  <dd>{transaction.customer_name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Contact</dt>
                  <dd>
                    <a href="tel:">{transaction.customer_contact}</a>
                  </dd>
                </div>
              </dl>
            </div>
            {
              transaction.rider && transaction.status !== "PENDING" &&
              <>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Delivery Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Rider</dt>
                      <dd>{`${transaction.rider.first_name} ${transaction.rider.middle_name} ${transaction.rider.last_name}`}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Contact</dt>
                      <dd>
                        <a href="tel:">{transaction.rider.contact_number}</a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </>
            }
          </CardContent>
          
        </Card>
        <DialogFooter>
          <Button type="button" variant={"outline"}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}

export default OpenShowTransaction;