
import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const Page = () => {
    return ( <Card
        className="overflow-hidden h-full" x-chunk="dashboard-05-chunk-4"
      >
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Select Order
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm min-h-[400px] flex items-center justify-center text-gray-500">
            <div>No Selected Order</div>
        </CardContent>
      </Card> );
}
 
export default Page;