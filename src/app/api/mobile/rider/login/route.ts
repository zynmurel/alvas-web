import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function POST(req: NextRequest) {
    const { username, password } = await req.json().then((data) => {
        return { ...data } as { username: string, password: string }
    })
    if (!username || !password) {
        return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
    }
    console.log("sean", username, password)

    try {
        const user = await db.delivery_rider.findUnique({
            where: { username },
        });

        if (!user) {
            return NextResponse.json({ message: "user_not_found", error: 'Invalid credentials', status: 401 }, { status: 200 });
        }
        const passwordMatch = password === user.password

        if (!passwordMatch) {
            return NextResponse.json({ message: "wrong_password", error: 'Invalid credentials', status: 401 }, { status: 200 });
        }
        const response = NextResponse.json({ status: 200, user : { 
            role: "rider", 
            user_id: user.id ,
            username: user.username, 
            first_name : user.first_name,
            middle_name : user.middle_name,
            last_name : user.last_name,
            contact_number : user.contact_number,
        } }, { status: 200 });
        return response

    } catch (error) {
        return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
    }

}