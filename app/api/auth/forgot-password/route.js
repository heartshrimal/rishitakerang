import { supabase } from "@/lib/supabase";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return Response.json({ error: "Username required" }, { status: 400 });
    }

    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !admin) {
      return Response.json({ success: true });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await supabase
      .from("admins")
      .update({
        reset_token: resetToken,
        reset_token_expires: expires,
        updated_at: new Date().toISOString(),
      })
      .eq("id", admin.id);

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Rishita Ke Rang" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "Reset Admin Password",
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
            <h2 style="color:#4d111f;">Password Reset Request</h2>
            <p>You requested a password reset for the Rishita Ke Rang admin dashboard.</p>
            <p>Click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="display:inline-block;background:#4d111f;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:500;margin:16px 0;">Reset Password</a>
            <p style="font-size:13px;color:#8b7355;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Failed to send reset email:", err);
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
