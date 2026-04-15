import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';
export async function GET() {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  return NextResponse.json(await prisma.post.findMany({ orderBy:{ createdAt:'desc' } }));
}
export async function POST(req: NextRequest) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const body = await req.json();
  const slug = slugify(body.title, { lower:true, strict:true });
  const existing = await prisma.post.findUnique({ where:{ slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
  const post = await prisma.post.create({ data:{ ...body, slug:finalSlug, tags:body.tags||[], publishedAt:body.published?new Date():null } });
  return NextResponse.json(post, { status:201 });
}
