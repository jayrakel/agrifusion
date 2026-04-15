import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where:{ slug:params.slug, active:true }, include:{ category:true } });
  if (!product) return NextResponse.json({ error:'Not found' }, { status:404 });
  await prisma.product.update({ where:{ id:product.id }, data:{ order:product.order } }); // just a no-op to keep it fresh
  const related = await prisma.product.findMany({ where:{ categoryId:product.categoryId, active:true, id:{ not:product.id } }, include:{ category:true }, take:4 });
  return NextResponse.json({ product, related });
}
