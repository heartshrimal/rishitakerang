import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("name", "Test Product (₹1)")
    .maybeSingle();

  if (existing) {
    return Response.json({ message: "Test product already exists", id: existing.id });
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: "Test Product (₹1)",
      category: "Earrings",
      slug: "earrings",
      price: 1,
      image: "/products/earrings.png",
      images: ["/products/earrings.png"],
      description: "Test product for payment testing — costs only ₹1.",
      details: ["Test item", " ₹1 only"],
      featured: false,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: "Test product created!", product: data });
}
