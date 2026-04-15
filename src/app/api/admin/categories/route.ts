import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';
export async function GET() {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  return NextResponse.json(await prisma.category.findMany({ orderBy:{ order:'asc' } }));
}
export async function POST(req: NextRequest) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const body = await req.json();
  const slug = slugify(body.name, { lower:true, strict:true });
  const cat = await prisma.category.create({ data:{ ...body, slug, active:true } });
  return NextResponse.json(cat, { status:201 });
}
