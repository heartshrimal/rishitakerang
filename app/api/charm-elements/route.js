import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const { data, error } = await supabase
    .from("charm_elements")
    .select("*")
    .eq("active", true)
    .order("id", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data || []);
}

export async function POST(request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const valid = await verifyToken(auth.slice(7));
  if (!valid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("charm_elements")
      .insert({
        name: body.name,
        category: body.category,
        image: body.image || null,
        price: Number(body.price),
        active: body.active !== false,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
