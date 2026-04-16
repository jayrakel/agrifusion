import { prisma } from './prisma';

export type Settings = Record<string, string>;

const DEFAULTS: Settings = {
  site_name:        'Agrifusion Co.',
  site_tagline:     'Rooted in Quality. Grown for Everyone.',
  site_description: "Nairobi's freshest agricultural marketplace.",
  logo_url:         '',
  favicon_url:      '',
  location_emoji:   '🇰🇪',
  location_name:    "Nyamira",
  contact_email:    'hello@agrifusion.co.ke',
  contact_phone:    '+254 700 000 000',
  contact_address:  'Westlands, Nairobi, Kenya',
  business_hours:   'Mon–Sat: 7AM–7PM · Sun: 8AM–5PM',
  delivery_fee:     '200',
  free_delivery_min:'2000',
  mpesa_paybill:    '',
  social_facebook:  '',
  social_instagram: '',
  social_twitter:   '',
  social_whatsapp:  '',
  hero_title:       'Rooted in Quality.\nGrown for Everyone.',
  hero_subtitle:    "Farm-fresh produce, quality seeds, dairy products and more — sourced directly from Kenya's finest farms.",
  hero_image:       '',
  hero_video:       '',
  stat_products:    '500+',
  stat_customers:   '10,000+',
  stat_farms:       '50+',
  stat_cities:      '5',
  about_story:      "Agrifusion Co. was born from a simple belief: every Kenyan deserves access to fresh, quality agricultural products at fair prices.",
  about_story2:     "From fresh vegetables harvested at dawn to certified organic produce — we are your one-stop agricultural marketplace.",
  notify_email:     'admin@agrifusion.co.ke',
};

export async function getSettings(): Promise<Settings> {
  try {
    const rows = await prisma.setting.findMany();
    const fromDb = rows.reduce((acc, r) => { acc[r.key] = r.value; return acc; }, {} as Settings);
    return { ...DEFAULTS, ...fromDb };
  } catch { return DEFAULTS; }
}

export async function updateSettings(data: Record<string, string>) {
  const ops = Object.entries(data).map(([key, value]) =>
    prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
  );
  return prisma.$transaction(ops);
}
