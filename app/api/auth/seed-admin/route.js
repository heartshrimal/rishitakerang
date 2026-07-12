import { hashPassword } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const username = process.env.ADMIN_USERNAME || "rishita";
    const password = process.env.ADMIN_PASSWORD || "rishita123";

    const { data: existing } = await supabase
      .from("admins")
      .select("id")
      .eq("username", username)
      .single();

    if (existing) {
      return Response.json({ message: "Admin already exists" });
    }

    const hash = await hashPassword(password);

    const { error } = await supabase
      .from("admins")
      .insert({ username, password_hash: hash });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: "Admin seeded successfully" });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
