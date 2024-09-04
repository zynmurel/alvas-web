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
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import Loading from "../../_components/loading"


const SettingsPage = () => {
  const { user } = useStore()
  const [delivery_fee, setDeliveryFee] = useState(0)
  const [password, setPassword] = useState({
    defaultPassForStaff : "",
    show : false
  })


  const onSuccess = ({ description }: { description: string }) => {
    toast({
      title: "Saved!",
      description
    })
  }

  const { data: settings, isPending } = api.settings.getSettings.useQuery({
    admin_id: Number(user?.id)
  }, {
    enabled: !!user
  })

  const { mutate: updateDeliveryFee, isPending: updateDeliveryFeeIsPending } = api.settings.updateDeliveryFee.useMutation({
    onSuccess: () => onSuccess({ description: "Delivery fee updated successfully." })
  })

  const { mutate: updateDefaultPassForStaff, isPending: updateDefaultPassForStaffIsPending } = api.settings.updateDefaultPassForStaff.useMutation({
    onSuccess: () => onSuccess({ description: "Delivery fee updated successfully." })
  })

  useEffect(() => {
    if (settings) {
      setDeliveryFee(settings.delivery_fee)
      setPassword(prev=>({...prev, defaultPassForStaff:settings.defaultPassForStaff}))
    }
  }, [settings])


  if (isPending) {
    return <Loading />
  }

    return ( 
          <div className="grid gap-6">

          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>Rider Settings</CardTitle>
              <CardDescription>
                {"Setting default delivery fee for rider."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className=" text-sm text-gray-800">Delivery Fee</div>
              <Input type="number" value={delivery_fee} onChange={(e) => setDeliveryFee(Number(e.target.value))} placeholder="Delivery fee" />
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-end">
              <Button 
              disabled={updateDeliveryFeeIsPending} 
              onClick={() => updateDeliveryFee({ delivery_fee, admin_id: Number(user?.id) })}
              >Save</Button>
            </CardFooter>
          </Card>


          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>Default Password</CardTitle>
              <CardDescription>
                {"Setting for default password on creating new staffs."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className=" text-sm text-gray-800">Password</div>
              <div className=" w-full flex flex-row gap-2 items-center">
                <Input type={password.show ? "text" : "password"} value={password.defaultPassForStaff} onChange={(e) => setPassword(prev=>({...prev, defaultPassForStaff : e.target.value}))} placeholder="Input password" />
                <div 
                onClick={()=>setPassword(prev=>({...prev, show : !prev.show}))}
                className=" text-sm text-gray-600 cursor-pointer"
                >{password.show ? "Hide" : "Show"}</div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-end">
              <Button 
              disabled={updateDefaultPassForStaffIsPending} 
              onClick={() => updateDefaultPassForStaff({ defaultPassForStaff:password.defaultPassForStaff, admin_id: Number(user?.id) })}
              >Save</Button>
            </CardFooter>
          </Card>
          </div>
         );
}
 
export default SettingsPage;