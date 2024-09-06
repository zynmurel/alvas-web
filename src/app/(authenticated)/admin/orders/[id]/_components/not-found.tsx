import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { OctagonX } from "lucide-react";
  const OrderNotFound = () => {
    return ( <Card
        className="overflow-hidden h-full" x-chunk="dashboard-05-chunk-4"
      >
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className=" flex items-center gap-2 text-lg">
              Order
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm min-h-[400px] flex items-center justify-center text-gray-500 flex-col gap-1">
          <OctagonX/>
            <div>Order Not Found</div>
        </CardContent>
      </Card> );
}
 
export default OrderNotFound;