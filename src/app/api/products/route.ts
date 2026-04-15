// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({ where:{ active:true }, include:{ category:true }, orderBy:{ order:'asc' } });
  return NextResponse.json(products);
}
