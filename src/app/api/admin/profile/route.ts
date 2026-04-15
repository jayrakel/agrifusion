import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
export async function GET() {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  return NextResponse.json(await prisma.user.findUnique({ where:{ id:(session.user as any).id }, select:{ id:true, name:true, email:true, role:true, mustChangePassword:true } }));
}
export async function PATCH(req: NextRequest) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const { name, email, currentPassword, newPassword } = await req.json();
  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where:{ id:userId } });
  if (!user) return NextResponse.json({ error:'User not found' }, { status:404 });
  const data: any = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (newPassword) {
    if (!await bcrypt.compare(currentPassword, user.password)) return NextResponse.json({ error:'Current password incorrect' }, { status:400 });
    data.password = await bcrypt.hash(newPassword, 12);
    data.mustChangePassword = false;
  }
  return NextResponse.json(await prisma.user.update({ where:{ id:userId }, data }));
}