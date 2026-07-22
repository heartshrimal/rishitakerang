import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function PUT(request, { params }) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const valid = await verifyToken(auth.slice(7));
  if (!valid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const updates = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.category !== undefined) updates.category = body.category;
    if (body.image !== undefined) updates.image = body.image;
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.active !== undefined) updates.active = body.active;

    const { data, error } = await supabase
      .from("charm_elements")
      .update(updates)
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const valid = await verifyToken(auth.slice(7));
  if (!valid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase
    .from("charm_elements")
    .delete()
    .eq("id", Number(id));

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
