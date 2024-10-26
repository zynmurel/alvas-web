'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { api } from "@/trpc/react"
import { useStore } from "@/lib/store/app"
import Loading from "../_components/loading"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"


const SettingsPage = () => {
  const { user } = useStore()
  const [store, setStore] = useState({
    store_name:"",
    extra_details:""
  })
  const [address, setAddress] = useState("")
  const [contact, setContact] = useState({
    email_address: "",
    contact_number: ""
  })
  const { data: settings, isPending } = api.settings.getSettings.useQuery({
    admin_id: Number(user?.id)
  }, {
    enabled: !!user
  })
  api.user_customer.account.getBarangays.useQuery()

  const onSuccess = ({ description }: { description: string }) => {
    toast({
      title: "Saved!",
      description
    })
  }

  const { mutate: updateStoreName, isPending: updateStoreNameIsPending } = api.settings.updateStoreName.useMutation({
    onSuccess: () => onSuccess({ description: "Store details updated successfully." })
  })

  const { mutate: updateContact, isPending: updateContactIsPending } = api.settings.updateContact.useMutation({
    onSuccess: () => onSuccess({ description: "Store contact updated successfully." })
  })

  useEffect(() => {
    if (settings) {
      setStore({
        store_name:settings.store_name,
        extra_details:settings.extra_details || ""
      })
      setAddress(settings.address)
      setContact({
        email_address: settings.email_address,
        contact_number: settings.contact_number,
      })
    }
  }, [settings])

  if (isPending) {
    return <Loading />
  }
  return (
    <div className="grid gap-6">
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Store</CardTitle>
        <CardDescription>
          Used to identify your store in the marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" text-sm text-gray-800">Name</div>
        <Input value={store.store_name} onChange={(e) => setStore(prev=>({...prev, store_name:e.target.value}))} placeholder="Store Name" />

        <div className=" text-sm text-gray-800 mt-5">Description</div>
        <Textarea value={store.extra_details} onChange={(e) => setStore((prev) => ({...prev, extra_details:e.target.value}))} placeholder="Description" />

        <div className=" text-sm text-gray-800 mt-5">Address</div>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Store Address" />

      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button disabled={updateStoreNameIsPending} onClick={() => updateStoreName({ ...store, address, admin_id: Number(user?.id) })}>Save</Button>
      </CardFooter>
    </Card>

      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            {"This is for your market's contact informations."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className=" text-sm text-gray-800">Email Address</div>
          <Input value={contact.email_address} onChange={(e) => setContact((prev) => ({ ...prev, email_address: e.target.value }))} placeholder="Email address" />

          <div className=" text-sm text-gray-800 mt-5">Contact Number</div>
          <Input value={contact.contact_number} onChange={(e) => setContact((prev) => ({ ...prev, contact_number: e.target.value }))} placeholder="Contact number" />
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end">
          <Button disabled={updateContactIsPending} onClick={() => updateContact({ ...contact, admin_id: Number(user?.id) })}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SettingsPage;