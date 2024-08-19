import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { type CredentialsType } from '@/lib/types/login';
import { createSessionToken } from '@/lib/session';

export async function POST(req: NextRequest) {
    const { username, password, role }= await req.json().then((data)=>{
      return {...data} as CredentialsType
    }) 
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
    }

    try {
        if(role ==="admin"){

            const user = await db.admin.findUnique({
                where: { username },
              });

            if (!user) {
              return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }
            const passwordMatch = password === user.password
      
            if (!passwordMatch) {
              return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }
            const sessionToken = createSessionToken({ username, password, role })
            const response = NextResponse.json({ message: 'Login successful', user: { username: user.username, role: "admin" } }, { status: 200 });
            response.cookies.set('session-token', sessionToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              path: '/',
            });
            return response
        }

        if(role ==="cashier"){

            const user = await db.cashier.findUnique({
                where: { username },
              });

            if (!user) {
              return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }
            const passwordMatch = password === user.password
      
            if (!passwordMatch) {
              return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }
            return NextResponse.json({ message: 'Login successful', user: { username: user.username, role: "cashier" } }, { status: 200 });
        }

    } catch (error) {
      return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
    }

}