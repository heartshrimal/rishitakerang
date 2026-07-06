import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("name", "Test Product")
    .maybeSingle();

  if (existing) {
    const { data: updated, error } = await supabase
      .from("products")
      .update({
        name: "Test Product",
        price: 0,
        description: "Test product for testing orders — free with no shipping.",
        details: ["Test item", " ₹0 — free"],
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ message: "Test product updated!", product: updated });
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: "Test Product",
      category: "Earrings",
      slug: "earrings",
      price: 0,
      image: "/products/earrings.png",
      images: ["/products/earrings.png"],
      description: "Test product for testing orders — free with no shipping.",
      details: ["Test item", " ₹0 — free"],
      featured: false,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: "Test product created!", product: data });
}
