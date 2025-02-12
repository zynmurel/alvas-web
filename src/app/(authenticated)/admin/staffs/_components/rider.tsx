'use client'

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
import { DataPagination } from "./table-components/pagination";
import { Edit, EllipsisVertical, PlusCircle, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Loading from "./table-components/loading";
import NoFound from "./table-components/no-found";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { type PaginationType } from "@/lib/types/pagination";
const Rider = () => {
  const router = useRouter()
  const [pagination, setPagination] = useState<PaginationType>({
    take: 10,
    skip: 0
  })
  const { data: rider, isPending: riderPending } = api.rider.getAllRider.useQuery()

  const { mutateAsync: resetPassword, isPending: resetPasswordPending } = api.rider.resetRiderPass.useMutation({
    onSuccess: () => toast({
      title: "Success",
      description: "Reset password success."
    })
  })

  return (
    <Card x-chunk="dashboard-06-chunk-0" className="shadow-sm">
      <CardHeader>
        <div className="flex flex-row items-start justify-between w-full ">
          <div>
            <CardTitle className="flex justify-between">
              Delivery Rider
            </CardTitle>
            <CardDescription className="mt-2">
              List of all delivery rider.
            </CardDescription>
          </div>
          <div>
            <Button size="sm" className="h-7 gap-1" onClick={() => router.push("staffs/form-rider/new")}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Rider
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead className="w-20">Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">
                Username
              </TableHead>
              <TableHead className=" w-20">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              rider?.slice(pagination.skip, pagination.skip + pagination.take).map((item) => ((
                <TableRow key={item.id}>
                  <TableCell className="w-20">
                    <div className={`bg-cover text-center w-full aspect-square overflow-hidden rounded-full border text-gray-400 flex items-center justify-center`}>
                      {/* Use Next.js Image component */}
                      {item.profile_image ? <img
                        src={item.profile_image}
                        alt="Profile Image"
                        // layout="fill" // This will make the image fill the container
                        // objectFit="cover" // This will maintain the aspect ratio of the image
                        className="rounded-full object-cover" // Ensure the image is also rounded
                      /> : <div className=" text-xs text-center">No image</div>}
                    </div>
                  </TableCell>
                  <TableCell className=" capitalize">
                    {`${item.first_name} ${item.middle_name} ${item.last_name}`}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.username}
                  </TableCell>
                  <TableCell>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVertical className="w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Button
                            size="sm"
                            className="flex justify-start w-full "
                            variant={"outline"}
                            onClick={() => router.push("staffs/form-rider/" + item.id)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Button
                            size="sm"
                            className="flex justify-start w-full "
                            variant={"outline"}
                            disabled={resetPasswordPending}
                            onClick={() => resetPassword({
                              id: item.id,
                              admin_id: item.admin_id
                            })}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Pass
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )))
            }
          </TableBody>
        </Table>
        {riderPending && <Loading />}
        {!riderPending && !rider?.length && <NoFound />}
        <DataPagination count={rider?.length || 0} filter={pagination} setFilter={setPagination} />
      </CardContent>
    </Card>
  );
}

export default Rider;