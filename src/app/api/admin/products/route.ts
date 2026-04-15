import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';
export async function GET() {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const products = await prisma.product.findMany({ include:{ category:true }, orderBy:{ createdAt:'desc' } });
  return NextResponse.json(products);
}
export async function POST(req: NextRequest) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const body = await req.json();
  const slug = slugify(body.name, { lower:true, strict:true });
  const existing = await prisma.product.findUnique({ where:{ slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
  const product = await prisma.product.create({ data:{ ...body, slug:finalSlug, images:body.images||[], tags:body.tags||[] }, include:{ category:true } });
  return NextResponse.json(product, { status:201 });
}
