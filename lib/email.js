import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAdminNotification(payment) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const paymentId = payment.razorpayPaymentId || payment.utr || "—";

  const html = `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
      <h2 style="color:#4d111f;">🛒 New Order Received!</h2>
      <p>A payment has been confirmed on <strong>Rishita Ke Rang</strong>.</p>
      <hr style="border:none;border-top:1px solid #e8d5c4;" />
      <table style="font-size:14px;color:#4d111f;width:100%;">
        <tr><td style="padding:4px 0;color:#8b7355;">Customer</td><td style="font-weight:500;">${payment.name}</td></tr>
        <tr><td style="padding:4px 0;color:#8b7355;">Phone</td><td style="font-weight:500;">${payment.phone}</td></tr>
        <tr><td style="padding:4px 0;color:#8b7355;">Product</td><td style="font-weight:500;">${payment.productName}</td></tr>
        <tr><td style="padding:4px 0;color:#8b7355;">Amount</td><td style="font-weight:500;">₹${payment.productPrice}</td></tr>
        <tr><td style="padding:4px 0;color:#8b7355;">${payment.razorpayPaymentId ? "Payment ID" : "UTR"}</td><td style="font-weight:500;">${paymentId}</td></tr>
        <tr><td style="padding:4px 0;color:#8b7355;">Date</td><td style="font-weight:500;">${new Date(payment.createdAt).toLocaleString()}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #e8d5c4;" />
      <p style="font-size:13px;color:#8b7355;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/dashboard" style="color:#4d111f;">View in Dashboard →</a>
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Rishita Ke Rang" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `🛒 New Order — ${payment.productName} (₹${payment.productPrice})`,
      html,
    });
  } catch (err) {
    console.error("Failed to send admin notification:", err);
  }
}
