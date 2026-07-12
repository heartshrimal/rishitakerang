import { createToken, comparePassword } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json({ error: "Username and password required" }, { status: 400 });
    }

    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !admin) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await comparePassword(password, admin.password_hash);
    if (!valid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createToken();

    return Response.json({ token });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
