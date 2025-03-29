import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "API路由已禁用" }, { status: 200 });
}

export async function POST() {
  return NextResponse.json({ message: "API路由已禁用" }, { status: 200 });
} 