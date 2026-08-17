import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'FundFlow Crowdfunding App Router API Gateway proxy online.',
    timestamp: new Date().toISOString(),
  });
}
