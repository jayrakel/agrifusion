# Agrifusion Co. — Agricultural E-Commerce Platform

## Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon) + Prisma ORM
- **Auth**: NextAuth.js v5 Beta
- **Storage**: Cloudinary
- **Email**: Resend
- **Payments**: Stripe
- **Styling**: Tailwind CSS

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in your environment variables

npm run db:push    # Push schema to DB
npm run db:seed    # Seed with sample data
npm run dev        # Start dev server
```

## Admin Login
- URL: /admin/login
- Email: admin@agrifusion.co.ke
- Password: admin123!

**Change password immediately after first login!**

## Features
- 🛒 Full e-commerce (cart, checkout, orders)
- 📦 Order tracking by order number
- 🥬 Product management with Cloudinary images
- 🗂️ Category management
- 📊 Admin dashboard with sales stats
- 💬 Contact message management
- 📝 Blog with rich content
- 📧 Newsletter with subscriber management
- ⭐ Product reviews with approval workflow
- ⚙️ Dynamic site settings (logo, colors, contact info, hero)
- 📱 M-Pesa + Card + Cash on Delivery payment options
- 🌙 Dark mode support
- 📱 Fully responsive mobile design
