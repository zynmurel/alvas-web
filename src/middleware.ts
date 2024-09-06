// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/session';

export async function middleware(req: NextRequest) {
  const session = getSession();

  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/admin', '/cashier', "/"], // Apply middleware to specific routes
};