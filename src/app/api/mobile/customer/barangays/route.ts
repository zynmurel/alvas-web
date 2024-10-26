import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET() {
    try {
        const barangays = await db.barangays.findMany().then((data) => data).catch(e => {
            throw new Error(e as string,)
        });
        if (barangays) {
            const response = NextResponse.json({
                status: 200, barangays:barangays
            }, { status: 200 });
            return response
        }

    } catch (error) {

        return NextResponse.json(
            { error, }, // Error message
            { status: 500 } // Status code
        );
    }
}