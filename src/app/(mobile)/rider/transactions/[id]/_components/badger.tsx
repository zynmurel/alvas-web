import { Badge } from "@/components/ui/badge"
import { type $Enums } from "@prisma/client"

export const BadgeStatus = ({ status }: { status: $Enums.transaction_status }) => {
    if (status === "PENDING") {
        return <Badge variant={"outline"} className=" border-orange-600 bg-orange-500 text-white">{status}</Badge>
    } else if (status === "ONGOING") {
        return <Badge variant={"outline"} className=" border-blue-600 bg-blue-500 text-white">{status}</Badge>
    } else if (status === "DONE") {
        return <Badge>{status}</Badge>
    } else if (status === "DELIVERED") {
        return <Badge className=" bg-blue-500 text-white">{status}</Badge>
    } else if (status === "CANCELLED") {
        return <Badge variant={"destructive"}>{status}</Badge>
    }
}