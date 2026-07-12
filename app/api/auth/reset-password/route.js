import { hashPassword } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return Response.json({ error: "Token and new password required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("reset_token", token)
      .single();

    if (error || !admin) {
      return Response.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    if (admin.reset_token_expires && new Date(admin.reset_token_expires) < new Date()) {
      return Response.json({ error: "Reset token has expired" }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);

    const { error: updateError } = await supabase
      .from("admins")
      .update({
        password_hash: newHash,
        reset_token: null,
        reset_token_expires: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", admin.id);

    if (updateError) {
      return Response.json({ error: "Failed to reset password" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
