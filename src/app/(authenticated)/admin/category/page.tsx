'use client'
import {
  LoaderCircle,
  MoreHorizontal,
  PackageSearch,
  PlusCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import { useState } from "react"
import CreateCategory from "./_components/create-category"
type CategoryType = undefined | {
  id:number;
  name:string | undefined;
}
const ProductsPage = () => {
  const router = useRouter()
  const [category, setCategory] = useState<CategoryType>(undefined)

  const onClickAddProduct = () => setCategory({
    id:0,
    name:undefined
  })

  const { data:categories, isLoading:categoriesLoading, refetch} = api.category.getCategories.useQuery()
  const { mutateAsync : deleteCategory, isPending } = api.category.deleteCategory.useMutation({
    onSuccess:()=> refetch()
  })

    return ( 
        <div className=" flex flex-col">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <div className=" flex flex-row items-center justify-between">
              <h1 className="text-3xl font-semibold">Categories</h1>
              <Button size="sm" className="h-7 gap-1" onClick={onClickAddProduct}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Category
                </span>
              </Button>
              <Dialog open={category?.id !== undefined} onOpenChange={()=>setCategory(undefined)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{category?.id === 0 ? "Create Category" : "Update Category"}</DialogTitle>
                    <DialogDescription>
                      {`Make changes to your category here. Click save when you're done.`}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <CreateCategory refetchCategory={refetch} category_id={category?.id} category_name={category?.name} closeDialog={()=>setCategory(undefined)}/>
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            <main className="flex flex-row gap-2">
                <Card x-chunk="dashboard-06-chunk-0" className=" flex-1 py-5">
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className=" w-40">
                              <span >Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        {(!categoriesLoading && categories?.length) ? <TableBody>
                          {
                            categories.map((prod, index)=>(
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {prod.category_name}
                                </TableCell>
                                <TableCell className=" w-40">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <Button onClick={()=>setCategory({
                                        id:Number(prod.id),
                                        name: prod.category_name
                                      })} size={"sm"} variant={"outline"} className=" w-full">
                                        Edit
                                      </Button>
                                      {!prod.products.length && <Button disabled={isPending} onClick={()=>deleteCategory({id:Number(prod.id)})} size={"sm"} variant={"outline"} className=" border border-red-400 mt-1 text-red-400 bg-red-50 w-full">
                                        Delete
                                      </Button>}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>))
                          }
                        </TableBody> : <></>}
                      </Table>
                      {categoriesLoading && <div className=" w-full flex p-5 justify-center items-center gap-2 flex-row text-gray-500"><LoaderCircle className=" animate-spin" />Loading...</div>}
                      {!categoriesLoading && !categories?.length && <div className=" w-full flex p-5 justify-center items-center gap-2 flex-row text-gray-500"><PackageSearch/>No Products Found</div>}
                    </CardContent>
                    {/* <CardFooter>
                      <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                        products
                      </div>
                    </CardFooter> */}
                  </Card>
            </main>
          </div>
        </div>
         );
}
 
export default ProductsPage;


