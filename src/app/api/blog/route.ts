import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  return NextResponse.json(await prisma.post.findMany({ where:{ published:true }, orderBy:{ publishedAt:'desc' } }));
}