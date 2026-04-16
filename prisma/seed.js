const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Agrifusion database...');

  // Admin user
  const password = await bcrypt.hash('admin123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@agrifusion.co.ke' },
    update: {},
    create: { name: 'Admin', email: 'admin@agrifusion.co.ke', password, role: 'SUPER_ADMIN' },
  });
  console.log('✅ Admin user created');

  // Settings
  const settings = [
    { key: 'site_name',        value: 'Agrifusion Co.' },
    { key: 'site_tagline',     value: 'Rooted in Quality. Grown for Everyone.' },
    { key: 'site_description', value: 'Nairobi\'s freshest agricultural marketplace. Farm-fresh produce, quality seeds, dairy, and more — delivered straight to your door.' },
    { key: 'logo_url',         value: '' },
    { key: 'favicon_url',      value: '' },
    { key: 'contact_email',    value: 'hello@agrifusion.co.ke' },
    { key: 'contact_phone',    value: '+254 700 000 000' },
    { key: 'contact_address',  value: 'Westlands, Nairobi, Kenya' },
    { key: 'business_hours',   value: 'Mon–Sat: 7AM–7PM · Sun: 8AM–5PM' },
    { key: 'delivery_fee',     value: '200' },
    { key: 'free_delivery_min',value: '2000' },
    { key: 'mpesa_paybill',    value: '' },
    { key: 'social_facebook',  value: 'https://facebook.com' },
    { key: 'social_instagram', value: 'https://instagram.com' },
    { key: 'social_twitter',   value: 'https://twitter.com' },
    { key: 'social_whatsapp',  value: '+254700000000' },
    { key: 'hero_title',       value: 'Rooted in Quality.\nGrown for Everyone.' },
    { key: 'hero_subtitle',    value: 'Farm-fresh produce, quality seeds, dairy products and more — sourced directly from Kenya\'s finest farms and delivered straight to your door.' },
    { key: 'hero_image',       value: '' },
    { key: 'stat_products',    value: '500+' },
    { key: 'stat_customers',   value: '10,000+' },
    { key: 'stat_farms',       value: '50+' },
    { key: 'stat_cities',      value: '5' },
    { key: 'about_story',      value: 'Agrifusion Co. was born from a simple belief: every Kenyan deserves access to fresh, quality agricultural products at fair prices. We connect the best local farms directly to your table, cutting out the middleman and ensuring both farmers and customers get a better deal.' },
    { key: 'about_story2',     value: 'From fresh vegetables harvested at dawn to certified organic produce, quality seeds for your farm, and fresh dairy — we are your one-stop agricultural marketplace, committed to supporting Kenya\'s farming community.' },
    { key: 'notify_email',     value: 'admin@agrifusion.co.ke' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log('✅ Settings seeded');

  // Categories
  const categories = [
    { name: 'Fresh Produce',      slug: 'fresh-produce',      icon: '🥬', description: 'Farm-fresh fruits and vegetables harvested daily', featured: true,  order: 1 },
    { name: 'Seeds & Fertilizers',slug: 'seeds-fertilizers',  icon: '🌱', description: 'Quality seeds and fertilizers for your farm',       featured: true,  order: 2 },
    { name: 'Dairy & Eggs',       slug: 'dairy-eggs',         icon: '🥛', description: 'Fresh milk, cheese, butter and free-range eggs',    featured: true,  order: 3 },
    { name: 'Livestock Products', slug: 'livestock-products', icon: '🥩', description: 'Quality meat and livestock products',               featured: true,  order: 4 },
    { name: 'Organic Products',   slug: 'organic-products',   icon: '🌿', description: 'Certified organic produce and products',            featured: false, order: 5 },
    { name: 'Farm Tools',         slug: 'farm-tools',         icon: '⚒️', description: 'Essential tools and equipment for farming',         featured: false, order: 6 },
  ];

  const createdCategories = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: { ...cat, active: true } });
    createdCategories[cat.slug] = c.id;
  }
  console.log('✅ Categories seeded');

  // Products
  const products = [
    // Fresh Produce
    { name: 'Fresh Sukuma Wiki (Kale)', slug: 'fresh-sukuma-wiki', description: 'Farm-fresh sukuma wiki (kale) harvested daily from our partner farms in Limuru. Rich in vitamins and minerals. Perfect for your daily meals.', price: 30, unit: 'bunch', stock: 200, categoryId: createdCategories['fresh-produce'], featured: true, organic: true, tags: ['vegetables', 'kale', 'greens', 'organic'] },
    { name: 'Tomatoes (Beef)', slug: 'tomatoes-beef', description: 'Large, juicy beef tomatoes sourced directly from Kirinyaga farms. Perfect for cooking sauces, salads and stews.', price: 80, comparePrice: 100, unit: 'kg', stock: 150, categoryId: createdCategories['fresh-produce'], featured: true, organic: false, tags: ['tomatoes', 'vegetables', 'fresh'] },
    { name: 'Sweet Bananas (Cavendish)', slug: 'sweet-bananas-cavendish', description: 'Sweet, perfectly ripened Cavendish bananas from Mount Kenya region farms. Excellent source of potassium and natural energy.', price: 60, unit: 'bunch', stock: 100, categoryId: createdCategories['fresh-produce'], featured: true, organic: false, tags: ['fruits', 'bananas', 'fresh'] },
    { name: 'Organic Spinach', slug: 'organic-spinach', description: 'Certified organic spinach grown without pesticides or chemicals. Tender leaves, rich in iron and vitamins. Perfect for smoothies and cooking.', price: 50, unit: 'bunch', stock: 80, categoryId: createdCategories['fresh-produce'], featured: false, organic: true, tags: ['spinach', 'organic', 'vegetables'] },
    { name: 'Red Onions', slug: 'red-onions', description: 'Premium red onions from Karatina market. Sharp flavour, long shelf life. Essential for every Kenyan kitchen.', price: 70, unit: 'kg', stock: 300, categoryId: createdCategories['fresh-produce'], featured: false, organic: false, tags: ['onions', 'vegetables', 'cooking'] },
    { name: 'Avocado (Hass)', slug: 'avocado-hass', description: 'Creamy Hass avocados from Muranga\'s famous avocado farms. Rich, buttery flavour. Packed with healthy fats.', price: 40, unit: 'piece', stock: 120, categoryId: createdCategories['fresh-produce'], featured: true, organic: false, tags: ['avocado', 'fruits', 'hass'] },

    // Seeds & Fertilizers
    { name: 'Maize Seeds (DK8031)', slug: 'maize-seeds-dk8031', description: 'High-yield DK8031 hybrid maize seeds. Drought tolerant, disease resistant. Expected yield of 40+ bags per acre under good management. Certified and tested.', price: 1200, unit: '2kg bag', stock: 50, categoryId: createdCategories['seeds-fertilizers'], featured: true, organic: false, tags: ['maize', 'seeds', 'hybrid', 'certified'] },
    { name: 'Sunflower Seeds', slug: 'sunflower-seeds', description: 'High-oil content sunflower seeds suitable for Kenyan climate. Excellent oil content of 42-45%. Matures in 90-100 days.', price: 450, unit: '1kg bag', stock: 40, categoryId: createdCategories['seeds-fertilizers'], featured: false, organic: false, tags: ['sunflower', 'seeds', 'oilseed'] },
    { name: 'CAN Fertilizer', slug: 'can-fertilizer', description: 'Calcium Ammonium Nitrate (CAN) fertilizer. 26% nitrogen content. Ideal for top-dressing maize, wheat, and vegetables. Boosts yield significantly.', price: 3800, unit: '50kg bag', stock: 30, categoryId: createdCategories['seeds-fertilizers'], featured: true, organic: false, tags: ['fertilizer', 'CAN', 'nitrogen', 'farming'] },

    // Dairy & Eggs
    { name: 'Fresh Whole Milk', slug: 'fresh-whole-milk', description: 'Pure, fresh whole milk collected daily from our dairy farms in Kiambu. Pasteurized and tested for quality. Rich, creamy taste.', price: 65, unit: 'liter', stock: 200, categoryId: createdCategories['dairy-eggs'], featured: true, organic: false, tags: ['milk', 'dairy', 'fresh'] },
    { name: 'Free-Range Eggs (Tray)', slug: 'free-range-eggs-tray', description: 'Free-range eggs from happy, grass-fed hens. Richer in Omega-3 and vitamins than caged eggs. 30 eggs per tray. Fresh from the farm.', price: 480, unit: 'tray of 30', stock: 60, categoryId: createdCategories['dairy-eggs'], featured: true, organic: true, tags: ['eggs', 'free-range', 'organic', 'dairy'] },
    { name: 'Fresh Yoghurt (Plain)', slug: 'fresh-yoghurt-plain', description: 'Creamy, natural plain yoghurt made from fresh whole milk. No preservatives, no artificial flavours. Perfect for breakfast or cooking.', price: 150, unit: '500ml', stock: 80, categoryId: createdCategories['dairy-eggs'], featured: false, organic: false, tags: ['yoghurt', 'dairy', 'fresh'] },

    // Livestock
    { name: 'Goat Meat (Fresh)', slug: 'goat-meat-fresh', description: 'Fresh goat meat from locally raised goats. Lean, tender and flavourful. Humanely raised on natural pasture. Cut to your preference.', price: 650, unit: 'kg', stock: 40, categoryId: createdCategories['livestock-products'], featured: true, organic: false, tags: ['goat', 'meat', 'fresh', 'livestock'] },

    // Organic
    { name: 'Organic Honey (Raw)', slug: 'organic-honey-raw', description: 'Pure, raw organic honey harvested from beehives in the Kenyan highlands. Unprocessed, unfiltered, and full of natural enzymes and antioxidants.', price: 800, comparePrice: 950, unit: '500g jar', stock: 35, categoryId: createdCategories['organic-products'], featured: true, organic: true, tags: ['honey', 'organic', 'raw', 'natural'] },
  ];

  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: { ...p, images: [] } });
  }
  console.log('✅ Products seeded');

  // Blog posts
  await prisma.post.upsert({
    where: { slug: 'best-vegetables-to-grow-in-nairobi' },
    update: {},
    create: {
      title: 'The 5 Best Vegetables to Grow in Nairobi\'s Climate',
      slug: 'best-vegetables-to-grow-in-nairobi',
      excerpt: 'Nairobi\'s mild climate is perfect for year-round vegetable gardening. Here are the top 5 vegetables every Nairobian should grow.',
      content: '<h2>Why Grow Your Own Vegetables?</h2><p>With rising food costs and increasing demand for fresh, chemical-free produce, growing your own vegetables in Nairobi has never made more sense. The city\'s altitude of 1,795m gives it a mild, temperate climate ideal for a wide range of vegetables year-round.</p><h2>1. Sukuma Wiki (Kale)</h2><p>The backbone of the Kenyan diet, sukuma wiki is incredibly easy to grow and extremely productive. It thrives in Nairobi\'s climate and can be harvested continuously for months.</p><h2>2. Tomatoes</h2><p>Whether in a garden, container, or small greenhouse, tomatoes do exceptionally well in Nairobi. Choose varieties like Moneymaker or Anna F1 for best results.</p><h2>3. Spinach</h2><p>Fast-growing and nutrient-rich, spinach germinates in just 7-10 days and is ready to harvest in 4-6 weeks. Perfect for small urban gardens.</p><h2>4. Green Capsicum</h2><p>Bell peppers thrive in Nairobi\'s warm days and cool nights. They\'re high-value crops that fetch good prices at local markets.</p><h2>5. French Beans</h2><p>Kenya is a major exporter of French beans for good reason — they grow beautifully in our highland climate and produce abundantly.</p><h2>Get Started</h2><p>Visit Agrifusion Co. for quality seeds, fertilizers, and expert farming advice. We stock certified seeds for all these vegetables and more.</p>',
      category: 'Farming Tips',
      tags: ['vegetables', 'nairobi', 'gardening', 'farming'],
      published: true,
      featured: true,
      publishedAt: new Date(),
    },
  });
  console.log('✅ Blog posts seeded');

  console.log('\n🎉 Seeding complete!');
  console.log('📋 Admin Login: admin@agrifusion.co.ke / admin123!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
