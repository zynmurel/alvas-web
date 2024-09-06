import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { LoaderCircle } from "lucide-react";
  const LoadingOrder = () => {
    return ( <Card
        className="overflow-hidden h-full" x-chunk="dashboard-05-chunk-4"
      >
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className=" flex items-center gap-2 text-lg">
              Order
            </CardTitle>
            <CardDescription>Date: Loading ...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm min-h-[400px] flex items-center justify-center text-gray-500 flex-col">
          <LoaderCircle className=" animate-spin"/>
            <div>Loading ...</div>
        </CardContent>
      </Card> );
}
 
export default LoadingOrder;