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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const CreateCategorySchema = z.object({
    category_name: z.string().min(2, { message: "Category name is required." }),
})

const CreateCategory = ({category_id, closeDialog, category_name, refetchCategory}:{category_id:number | undefined; closeDialog:()=>void; category_name:string|undefined; refetchCategory:()=>void}) => {
  const { user } = useStore()
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof CreateCategorySchema>>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {}
  })

  const onSave = () => router.push("category")

  const { mutateAsync, isPending } = api.category.upsertCategory.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "New Category added successfully!"
      })
      onSave()
      closeDialog()
      refetchCategory()
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Creating category failed",
        description: e.message
      })
    }
  })

  const onSubmitCategory = async (data: z.infer<typeof CreateCategorySchema>) => {
      if (user?.id) {
        return mutateAsync({
          category_name: data.category_name,
          id:category_id || 0
        })
      } else {
        throw new Error("User not found")
      }
    }
  
  useEffect(()=>{
    !!category_name && form.setValue("category_name", category_name)
  },[category_id, category_name])

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitCategory)} className="flex flex-col w-full space-y-6">
          <div className="w-full">
            <div className="flex justify-center items-center flex-col">
              <div className=" w-full flex flex-col gap-3">
              <FormField
                  control={form.control}
                  name="category_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is for the name of the category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=" flex flex-row gap-1 items-end justify-end w-full">
                  <Button variant={"outline"} type="submit" onClick={closeDialog}>Cancel</Button>
                  <Button type="submit" disabled={isPending}>{"Submit Category"}</Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateCategory;