import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET(_: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  return NextResponse.json(await prisma.post.findUnique({ where:{ id:params.id } }));
}
export async function PATCH(req: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const body = await req.json();
  const existing = await prisma.post.findUnique({ where:{ id:params.id } });
  if (body.published && !existing?.published) body.publishedAt = new Date();
  return NextResponse.json(await prisma.post.update({ where:{ id:params.id }, data:{ ...body, tags:body.tags||[] } }));
}
export async function DELETE(_: NextRequest, { params }: { params:{ id:string } }) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  await prisma.post.delete({ where:{ id:params.id } });
  return NextResponse.json({ success:true });
}
