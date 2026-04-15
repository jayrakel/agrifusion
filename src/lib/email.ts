// src/lib/email.ts — powered by Resend
import { Resend } from 'resend';
import { getSettings } from './settings';

const resend = new Resend(process.env.RESEND_API_KEY);

function appUrl(): string {
  const url = process.env.NEXTAUTH_URL || process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || '';
  return url.replace(/\/$/, '');
}

async function buildEmail(content: string, footerExtras = '') {
  const s = await getSettings().catch(() => ({} as Record<string,string>));
  const logo = s.logo_url || '';
  const header = logo
    ? `<img src="${logo}" alt="${s.site_name}" style="height:48px;width:auto;display:block;margin:0 auto;"/>`
    : `<h1 style="color:#16A34A;margin:0;font-size:22px;font-weight:900;">${s.site_name || 'Agrifusion Co.'}</h1>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0FDF4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 10px;background:#F0FDF4;">
  <tr><td align="center">
    <table width="100%" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(22,163,74,.08);">
      <tr><td style="background:linear-gradient(135deg,#16A34A,#15803D);padding:32px;text-align:center;">${header}</td></tr>
      <tr><td style="padding:40px 32px;color:#14532D;font-size:15px;line-height:1.7;">${content}</td></tr>
      <tr><td style="background:#F0FDF4;padding:28px;text-align:center;border-top:1px solid #D1FAE5;">
        <p style="margin:0;color:#4B7C5E;font-size:12px;">© ${new Date().getFullYear()} ${s.site_name || 'Agrifusion Co.'} · Nairobi, Kenya</p>
        ${footerExtras}
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

async function send(opts: { to: string|string[]; subject: string; html: string; replyTo?: string }) {
  if (!process.env.RESEND_API_KEY) { console.log('[Email skipped]', opts.subject); return; }
  try {
    const s = await getSettings();
    await resend.emails.send({ from: `${s.site_name || 'Agrifusion Co.'} <hello@agrifusion.co.ke>`, ...opts });
  } catch (e) { console.error('[Resend error]', e); }
}

// ── Order confirmation to customer ───────────────────────
export async function sendOrderConfirmation(order: {
  orderNumber: string; customerName: string; customerEmail: string;
  items: { name: string; quantity: number; price: number; unit: string }[];
  subtotal: number; deliveryFee: number; total: number; deliveryAddress: string;
}) {
  const itemRows = order.items.map(i =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #D1FAE5;">${i.name} (${i.unit})</td>
     <td style="text-align:center;padding:8px 0;border-bottom:1px solid #D1FAE5;">×${i.quantity}</td>
     <td style="text-align:right;padding:8px 0;border-bottom:1px solid #D1FAE5;font-weight:600;">KES ${(i.price * i.quantity).toLocaleString()}</td></tr>`
  ).join('');

  const content = `
    <h2 style="color:#14532D;margin-top:0;">Order Confirmed! 🌿</h2>
    <p>Hi <strong>${order.customerName}</strong>, thank you for your order. We've received it and it's being prepared.</p>
    <div style="background:#F0FDF4;border-radius:12px;padding:20px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#4B7C5E;">Order Number</p>
      <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#16A34A;">#${order.orderNumber}</p>
    </div>
    <table width="100%" style="border-collapse:collapse;margin:20px 0;">
      <thead><tr>
        <th style="text-align:left;padding-bottom:8px;color:#4B7C5E;font-size:12px;text-transform:uppercase;">Item</th>
        <th style="text-align:center;padding-bottom:8px;color:#4B7C5E;font-size:12px;">Qty</th>
        <th style="text-align:right;padding-bottom:8px;color:#4B7C5E;font-size:12px;">Total</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <table width="100%" style="margin-top:12px;">
      <tr><td>Subtotal</td><td style="text-align:right;">KES ${order.subtotal.toLocaleString()}</td></tr>
      <tr><td>Delivery</td><td style="text-align:right;">KES ${order.deliveryFee.toLocaleString()}</td></tr>
      <tr><td style="padding-top:8px;font-weight:900;font-size:18px;color:#16A34A;">Total</td>
          <td style="text-align:right;padding-top:8px;font-weight:900;font-size:18px;color:#16A34A;">KES ${order.total.toLocaleString()}</td></tr>
    </table>
    <div style="margin-top:20px;padding:16px;background:#F0FDF4;border-radius:10px;border-left:4px solid #16A34A;">
      <p style="margin:0;font-size:13px;color:#4B7C5E;">Delivery Address</p>
      <p style="margin:4px 0 0;color:#14532D;">${order.deliveryAddress}</p>
    </div>
    <p style="margin-top:20px;color:#4B7C5E;font-size:13px;">You'll receive another email when your order is out for delivery. You can also track your order on our website using order number <strong>#${order.orderNumber}</strong>.</p>`;

  await send({ to: order.customerEmail, subject: `Order Confirmed #${order.orderNumber} — Agrifusion Co.`, html: await buildEmail(content) });
}

// ── New order notification to admin ──────────────────────
export async function sendNewOrderNotification(order: { orderNumber: string; customerName: string; customerEmail: string; total: number }) {
  const s = await getSettings();
  const content = `
    <h2 style="color:#14532D;margin-top:0;">New Order Received 🛒</h2>
    <p>A new order has been placed on Agrifusion Co.</p>
    <table width="100%" style="background:#F0FDF4;border-radius:12px;padding:20px;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#4B7C5E;">Order #</td><td style="font-weight:700;color:#16A34A;">#${order.orderNumber}</td></tr>
      <tr><td style="padding:6px 0;color:#4B7C5E;">Customer</td><td>${order.customerName}</td></tr>
      <tr><td style="padding:6px 0;color:#4B7C5E;">Email</td><td>${order.customerEmail}</td></tr>
      <tr><td style="padding:6px 0;color:#4B7C5E;">Total</td><td style="font-weight:700;">KES ${order.total.toLocaleString()}</td></tr>
    </table>
    <div style="text-align:center;margin-top:24px;">
      <a href="${appUrl()}/admin/orders" style="background:linear-gradient(135deg,#16A34A,#15803D);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">View Order →</a>
    </div>`;
  await send({ to: s.notify_email || 'admin@agrifusion.co.ke', subject: `New Order #${order.orderNumber} — KES ${order.total.toLocaleString()}`, html: await buildEmail(content) });
}

// ── Contact form notification ─────────────────────────────
export async function sendContactNotification(msg: { name: string; email: string; phone?: string; subject?: string; message: string }) {
  const s = await getSettings();
  const content = `
    <h2 style="color:#14532D;margin-top:0;">New Contact Message</h2>
    <table width="100%" style="background:#F0FDF4;border-radius:12px;padding:20px;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#4B7C5E;">Name</td><td>${msg.name}</td></tr>
      <tr><td style="padding:6px 0;color:#4B7C5E;">Email</td><td><a href="mailto:${msg.email}" style="color:#16A34A;">${msg.email}</a></td></tr>
      ${msg.phone ? `<tr><td style="padding:6px 0;color:#4B7C5E;">Phone</td><td>${msg.phone}</td></tr>` : ''}
      ${msg.subject ? `<tr><td style="padding:6px 0;color:#4B7C5E;">Subject</td><td>${msg.subject}</td></tr>` : ''}
    </table>
    <p style="background:#f8fffe;border-left:4px solid #16A34A;padding:16px;border-radius:6px;white-space:pre-wrap;">${msg.message}</p>`;
  await send({ to: s.notify_email || 'admin@agrifusion.co.ke', replyTo: msg.email, subject: `New Message from ${msg.name}`, html: await buildEmail(content) });
}

// ── Subscription confirmation ─────────────────────────────
export async function sendSubscriptionConfirm(opts: { email: string; name?: string; token: string }) {
  const confirmUrl = `${appUrl()}/api/subscribe/confirm?token=${opts.token}`;
  const content = `
    <h2 style="color:#14532D;margin-top:0;text-align:center;">Almost there! 🌿</h2>
    <p style="text-align:center;">Hi ${opts.name || 'there'}, thanks for subscribing to Agrifusion updates.</p>
    <p style="text-align:center;">Click below to confirm your email and start receiving fresh farm news, seasonal offers, and exclusive deals.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${confirmUrl}" style="background:linear-gradient(135deg,#16A34A,#15803D);color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">Confirm Subscription ✓</a>
    </div>
    <p style="color:#4B7C5E;font-size:12px;text-align:center;">If you didn't sign up, you can safely ignore this email.</p>`;
  await send({ to: opts.email, subject: 'Confirm your subscription — Agrifusion Co.', html: await buildEmail(content) });
}

// ── Newsletter broadcast ──────────────────────────────────
export async function sendNewsletter(opts: { subject: string; content: string; subscribers: { email: string; name?: string|null; token: string }[] }) {
  for (const sub of opts.subscribers) {
    const unsubUrl = `${appUrl()}/api/unsubscribe?token=${sub.token}`;
    const firstName = sub.name ? sub.name.split(' ')[0] : 'there';
    const personalised = opts.content.replace(/\{\{name\}\}/gi, firstName);
    const footer = `<p style="margin:12px 0 0;"><a href="${unsubUrl}" style="color:#4B7C5E;font-size:11px;">Unsubscribe</a></p>`;
    await send({ to: sub.email, subject: opts.subject.replace(/\{\{name\}\}/gi, firstName), html: await buildEmail(`<div style="white-space:pre-wrap;">${personalised}</div>`, footer) });
  }
}
