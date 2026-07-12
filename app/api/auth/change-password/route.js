import { verifyToken, hashPassword, comparePassword } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const auth = request.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const valid = await verifyToken(auth.slice(7));
    if (!valid) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return Response.json({ error: "Current and new password required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return Response.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    const { data: admin, error: fetchError } = await supabase
      .from("admins")
      .select("*")
      .eq("username", "rishita")
      .single();

    if (fetchError || !admin) {
      return Response.json({ error: "Admin not found" }, { status: 404 });
    }

    const passwordValid = await comparePassword(currentPassword, admin.password_hash);
    if (!passwordValid) {
      return Response.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    const newHash = await hashPassword(newPassword);

    const { error: updateError } = await supabase
      .from("admins")
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq("id", admin.id);

    if (updateError) {
      return Response.json({ error: "Failed to update password" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
