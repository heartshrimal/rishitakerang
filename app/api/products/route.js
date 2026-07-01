import { verifyToken } from "@/lib/auth";
import { getAllProducts, addProduct } from "@/lib/store";

export async function GET() {
  const products = await getAllProducts();
  return Response.json(products);
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
    const product = await addProduct({
      name: body.name,
      category: body.category,
      slug: body.slug,
      price: Number(body.price),
      image: body.images?.[0] || "/products/placeholder.svg",
      images: body.images || [],
      description: body.description || "",
      details: body.details || [],
      featured: body.featured || false,
    });

    return Response.json(product, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
