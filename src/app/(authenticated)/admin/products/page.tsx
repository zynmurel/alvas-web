'use client'
import Image from "next/image"
import {
  File,
  ListFilter,
  LoaderCircle,
  MoreHorizontal,
  PackageSearch,
  PlusCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import { useEffect, useState } from "react"
import { formatCurrency } from "@/app/helper/format"
type StatusType ="ALL" | "AVAILABLE" | "NOT_AVAILABLE"
type CategoryType = "ALL" | "CHICKEN" | "CHICHARON" | "RICE" | "DRINKS"
const ProductsPage = () => {
  const router = useRouter()
  const [status, setStatus] = useState<StatusType>("ALL")
  const [category, setCategory] = useState<CategoryType>("ALL")

  const onClickAddProduct = () => router.push("products/create-product")

  const { data:products, isLoading:productsIsLoading} = api.product.getAllProducts.useQuery({ status, category })

  // useEffect(()=>{
  //   (async()=>await getProducts())
  // },[getProducts, status, category])
  
  console.log(products)
    return ( 
        <div className=" flex flex-col">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Products</h1>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <Tabs defaultValue={status} onValueChange={(e)=>setStatus(e as StatusType)}>
                <div className="flex items-center">
                  <TabsList>
                    <TabsTrigger value="ALL">All</TabsTrigger>
                    <TabsTrigger value="AVAILABLE">Active</TabsTrigger>
                    <TabsTrigger value="NOT_AVAILABLE">Archived</TabsTrigger>
                  </TabsList>
                  <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 gap-1">
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Filter
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {
                          ["ALL" , "CHICKEN" , "CHICHARON" , "RICE" , "DRINKS"].map((cat)=>(
                            <DropdownMenuCheckboxItem key={cat} onClick={()=>setCategory(cat as CategoryType)} checked={cat===category}>
                              {cat}
                            </DropdownMenuCheckboxItem>))
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" className="h-7 gap-1" onClick={onClickAddProduct}>
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Product
                      </span>
                    </Button>
                  </div>
                </div>
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                      <CardTitle>Products</CardTitle>
                      <CardDescription>
                        Manage your products and view their sales performance.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                              <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        {(!productsIsLoading && products?.length) ? <TableBody>
                          {
                            products.map((prod, index)=>(
                              <TableRow key={index}>
                                <TableCell className="hidden sm:table-cell">
                                  <img
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src={prod.image_url}
                                    width="64"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  {prod.product_name}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{prod.status}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {prod.category}
                                </TableCell>
                                <TableCell>{formatCurrency(prod.amount)}</TableCell>
                                <TableCell>
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
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>))
                          }
                        </TableBody> : <></>}
                      </Table>
                      {productsIsLoading && <div className=" w-full flex p-5 justify-center items-center gap-2 flex-row text-gray-500"><LoaderCircle className=" animate-spin" />Loading...</div>}
                      {!productsIsLoading && !products?.length && <div className=" w-full flex p-5 justify-center items-center gap-2 flex-row text-gray-500"><PackageSearch/>No Products Found</div>}
                    </CardContent>
                    {/* <CardFooter>
                      <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                        products
                      </div>
                    </CardFooter> */}
                  </Card>
              </Tabs>
            </main>
          </div>
        </div>
         );
}
 
export default ProductsPage;


