// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log(req)
  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/admin', '/cashier', "/"], // Apply middleware to specific routes
};