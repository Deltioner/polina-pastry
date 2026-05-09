import "server-only";
import nodemailer from "nodemailer";
import type { CartItem } from "@/types";

interface OrderEmailPayload {
  orderId: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string | null;
  pickup_date: string | null;
  notes: string | null;
  items: CartItem[];
  total: number;
  paid: boolean;
}

/**
 * Sends two emails via Gmail SMTP (using a Google App Password):
 *   1) order-received notification → POLINA_EMAIL
 *   2) confirmation → customer's email address
 *
 * Silently no-ops when env vars aren't set, so dev without a configured
 * Gmail App Password doesn't crash. Logs failures.
 */
export async function sendOrderEmails(p: OrderEmailPayload): Promise<void> {
  const polinaEmail = process.env.POLINA_EMAIL;
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!polinaEmail || !appPassword || appPassword.startsWith("PASTE_")) {
    console.warn("[email] POLINA_EMAIL or GMAIL_APP_PASSWORD missing — skipping.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: polinaEmail, pass: appPassword },
  });

  const fromHeader = `"Polina Pastry" <${polinaEmail}>`;

  const itemRows = p.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 12px 6px 0;">${escapeHtml(
          i.product.name.en,
        )} × ${i.quantity}</td><td style="padding:6px 0;text-align:right;">€${(
          i.product.price * i.quantity
        ).toFixed(2)}</td></tr>`,
    )
    .join("");

  const sharedSummary = `
    <table style="border-collapse:collapse;width:100%;font-family:Inter,sans-serif;color:#4A1518;">
      ${itemRows}
      <tr><td colspan="2"><hr style="border:none;border-top:1px solid #FFDDD2;margin:8px 0;"/></td></tr>
      <tr style="font-weight:600;">
        <td style="padding:6px 0;">Total</td>
        <td style="padding:6px 0;text-align:right;">€${p.total.toFixed(2)}</td>
      </tr>
    </table>
  `;

  const paidBadge = p.paid
    ? `<span style="background:#DCFCE7;color:#166534;padding:3px 10px;border-radius:999px;font-size:12px;">PAID</span>`
    : `<span style="background:#FEF9C3;color:#854D0E;padding:3px 10px;border-radius:999px;font-size:12px;">UNPAID</span>`;

  await transporter.sendMail({
    from: fromHeader,
    to: polinaEmail,
    replyTo: p.customer_email,
    subject: `New order #${p.orderId.slice(0, 8)} — €${p.total.toFixed(2)}${p.paid ? " (paid)" : ""}`,
    html: `
      <div style="max-width:560px;margin:0 auto;padding:24px;font-family:Inter,sans-serif;color:#4A1518;">
        <h1 style="font-family:'Fraunces',serif;color:#9C2A3F;font-weight:500;margin:0 0 8px;">New order ${paidBadge}</h1>
        <p style="color:#8B5A2B;font-style:italic;margin:0 0 16px;">A sweet new order just came in.</p>
        <p><strong>Order ID:</strong> ${p.orderId}</p>
        <p><strong>Customer:</strong> ${escapeHtml(p.customer_name)} &lt;${escapeHtml(p.customer_email)}&gt;<br/>
           <strong>Phone:</strong> ${escapeHtml(p.customer_phone)}<br/>
           ${p.pickup_date ? `<strong>Pickup / delivery date:</strong> ${escapeHtml(p.pickup_date)}<br/>` : ""}
           ${p.delivery_address ? `<strong>Address:</strong> ${escapeHtml(p.delivery_address)}<br/>` : ""}
           ${p.notes ? `<strong>Notes:</strong> ${escapeHtml(p.notes)}` : ""}
        </p>
        <h2 style="font-family:'Fraunces',serif;color:#9C2A3F;font-weight:500;margin:24px 0 8px;font-size:18px;">Order</h2>
        ${sharedSummary}
      </div>
    `,
  });

  await transporter.sendMail({
    from: fromHeader,
    to: p.customer_email,
    replyTo: polinaEmail,
    subject: `Thank you for your order — Polina Pastry`,
    html: `
      <div style="max-width:560px;margin:0 auto;padding:24px;font-family:Inter,sans-serif;color:#4A1518;">
        <h1 style="font-family:'Fraunces',serif;color:#9C2A3F;font-weight:500;margin:0 0 8px;">Thank you, ${escapeHtml(p.customer_name)}!</h1>
        <p style="color:#8B5A2B;font-style:italic;margin:0 0 16px;">created by hand, baked with love</p>
        <p>${
          p.paid
            ? "We received your payment and your order is confirmed. Polina will reach out within 24 hours to arrange pickup or delivery."
            : "We received your order. Polina will reach out within 24 hours to confirm details."
        }</p>
        <p style="margin-top:16px;"><strong>Order reference:</strong> ${p.orderId.slice(0, 8)}</p>
        <h2 style="font-family:'Fraunces',serif;color:#9C2A3F;font-weight:500;margin:24px 0 8px;font-size:18px;">Your order</h2>
        ${sharedSummary}
        <p style="margin-top:24px;color:#8B5A2B;">With love,<br/><span style="font-family:'Caveat',cursive;font-size:22px;color:#9C2A3F;">Polina</span></p>
      </div>
    `,
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
