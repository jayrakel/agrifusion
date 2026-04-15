import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/settings';
export async function GET() {
  const s = await getSettings();
  const allowed = ['site_name','site_tagline','logo_url','contact_email','contact_phone','contact_address','business_hours','delivery_fee','free_delivery_min','mpesa_paybill','social_facebook','social_instagram','social_twitter','social_whatsapp','hero_title','hero_subtitle','hero_image','stat_products','stat_customers','stat_farms','stat_cities'];
  const pub: Record<string,string> = {};
  for (const k of allowed) pub[k] = s[k] || '';
  return NextResponse.json(pub);
}