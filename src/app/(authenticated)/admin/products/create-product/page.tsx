'use client'
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useStore } from "@/lib/store/app";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { uploadImage } from "@/app/helper/upload";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
const categories = ["CHICKEN", "CHICHARON", "RICE", "DRINKS"]
const CreateProductSchema = z.object({
  image_url: z.instanceof(File)
    .optional()
    .refine((file) => !file || (file.size / 1024 / 1024) <= 10, 'File size must be less than 10MB')
    .refine((file) => file ? ['image/png', 'image/jpeg'].includes(file.type) : true, 'File must be a PNG or JPEG'),
  product_name: z.string().min(2, { message: "Product name is required." }),
  category: z.enum(["CHICKEN", "CHICHARON", "RICE", "DRINKS"], { message: "Product category is required." }),
  amount: z.coerce.number({ message: "Invalid number" }),
})

const Page = () => {
  const [productImage, setProductImage] = useState<string|null>(null)
  const { user } = useStore()
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof CreateProductSchema>>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {}
  })

  const onSave = () => router.push("products")

  const { mutateAsync, isPending } = api.product.upsertProduct.useMutation({
    onSuccess:()=>{
      toast({
        title:"Success!",
        description:"New Product added successfully!"
      })
      onSave()
    },
    onError : (e) =>{
      toast({
        variant:"destructive",
        title:"Uploading Image Error!",
        description:e.message
      })
    }
  })

  const _uploadImage = async (file:File | undefined) => {
    if(file){
      return await uploadImage(file)
    }else{
      return null
    }
  }

  const onSubmitProduct = async (data: z.infer<typeof CreateProductSchema>) => {
    const image = await _uploadImage(data.image_url)
    if(image){
      if(user?.id){
        return mutateAsync({
          admin_id : user.id,
          product_name:data.product_name,
          image_url:image,
          category:data.category,
          amount:data.amount
        })
      }else {
        throw new Error("User not found")
      }
    } else {
      throw new Error("Uploading Image Error")
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitProduct)} className="flex flex-col w-full my-5 space-y-6">
          <div className="w-full space-y-6">
            <h1 className="font-medium ">Product Details</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              <FormField
                control={form.control}
                name="image_url"
                render={() => (
                  <FormItem className="flex flex-col justify-start w-full lg:col-span-1 col-span-full">
                    <FormLabel className="text-gray-600">Banner Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between w-40 my-2 overflow-hidden border-2 border-dashed rounded-3xl">
                        <label htmlFor="file" className="flex flex-col items-center justify-center w-full gap-2 text-xs text-gray-500 cursor-pointer aspect-square">
                          {
                                    productImage ? <img alt="Product Image" src={productImage} className="object-cover w-full h-full hover:brightness-75"/> : 
                                        <>
                                            <Plus/>
                                            <span>Tour Banner</span>
                                        </>
                                    }
                          <input
                            id="file"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const base64String = reader.result as string;
                                  setProductImage(base64String);
                                };
                                reader.readAsDataURL(file);
                                form.setValue("image_url", file)
                              }
                            }
                            }
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is your image for the product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 col-span-full lg:col-span-3 xl:col-span-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is for the name of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-600">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Product Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            categories.map((cat) => (<SelectItem value={cat} key={cat} className=" capitalize">{cat}</SelectItem>))
                          }
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is for the category of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-gray-600">Product Price ( ₱ )</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Input amount"  />
                    </FormControl>
                    <FormDescription>
                        This is the amount of the product.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="self-end ">{"Submit Product"}</Button>
        </form>
      </Form>
    </div>
  );
}

export default Page;