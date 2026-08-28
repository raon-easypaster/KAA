import { NextResponse } from 'next/server';
import { recordAndGetVisits, getVisits } from '@/app/lib/actions';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
    const data = await getVisits();
    return NextResponse.json(data, { headers: corsHeaders });
}

export async function POST() {
    const data = await recordAndGetVisits();
    return NextResponse.json(data, { headers: corsHeaders });
}
