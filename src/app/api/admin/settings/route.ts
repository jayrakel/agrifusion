import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSettings, updateSettings } from '@/lib/settings';
export async function GET() {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  return NextResponse.json(await getSettings());
}
export async function PATCH(req: NextRequest) {
  const session = await auth(); if (!session) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  await updateSettings(await req.json());
  return NextResponse.json({ success:true });
}