import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function POST(req: NextRequest) {
    const data = await req.json().then((data) => {
        return { ...data } as {
            username: string;
            password: string;
            first_name: string;
            middle_name: string;
            last_name: string;
            address: string;
            place_description: string;
            contact_number: string;
            barangayId : number
        }
    })
    try {
        const user = await db.customer.create({
            data : {
                ...data
            }
        }).then((data)=>data).catch(e=>{
            throw new Error(e as string,)
        });
        if(user){
            const response = NextResponse.json({
                status: 200, user: {
                    role: "customer",
                    user_id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    middle_name: user.middle_name,
                    last_name: user.last_name,
                    contact_number: user.contact_number,
                    address: user.address,
                    place_description: user.place_description,
                }
            }, { status: 200 });
            return response
        }

    } catch (error) {
        let err = null
        if(String(error).includes("Unique constraint failed on the fields: (`username`)")){
            err = "username"
        }else if(String(error).includes("Unique constraint failed on the fields: (`contact_number`)")){
            err = "contact_number"
        }
        return NextResponse.json(
            { error: err||error, }, // Error message
            { status: 200 } // Status code
          );
    }

}