import { z } from "zod";

export const onlyString = z.string().refine((data)=>{
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(data)
},{
    message : "Invalid name"
})

export const isMobileNumber = z.string().refine((data)=>{
    const phMobileRegex = /^(09\d{9}|(\+639)\d{9})$/;
    return phMobileRegex.test(data)
},{
    message : "Incorrect phone number format"
})