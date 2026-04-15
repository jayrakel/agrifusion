import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
export async function POST(req: NextRequest) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const folder = (formData.get('folder') as string) || 'agrifusion';
  if (!file) return NextResponse.json({ error:'No file' }, { status:400 });
  const result = await uploadToCloudinary(Buffer.from(await file.arrayBuffer()), { folder });
  await prisma.media.create({ data:{ name:file.name, url:result.url, publicId:result.publicId, type:'image', size:result.size, folder } });
  return NextResponse.json(result);
}
export async function DELETE(req: NextRequest) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const { publicId, id } = await req.json();
  await deleteFromCloudinary(publicId);
  if (id) await prisma.media.delete({ where:{ id } });
  return NextResponse.json({ success:true });
}