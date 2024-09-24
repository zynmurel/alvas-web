'use client'
import { useStore } from "@/lib/store/app"
import axios from "axios"
import { useEffect } from "react"

const Template = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { setUser } = useStore()

    const logout =async () => {
      await axios.post('/api/auth/logout')
      window.location.href = '/';
    }
    useEffect(()=>{
      const localUser = localStorage.getItem("user") || null
      const user = ( localUser ? JSON.parse(localUser):null) as {username :string; role:string; user_id:string} | null 
      if(user){
        console.log("hehe")
        setUser({
          id:Number(user.user_id),
          role:user.role,
          username:user.username
        })
      }else {
        (async()=>await logout())
      }
    },[])
    return ( <>{children}</> );
}
 
export default Template;