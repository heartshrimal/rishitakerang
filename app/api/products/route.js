import { verifyToken } from "@/lib/auth";
import { getAllProducts, addProduct } from "@/lib/store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const category = searchParams.get("category") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;
  const sort = searchParams.get("sort") || "default";

  let products = await getAllProducts();

  if (q) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }

  if (category) {
    products = products.filter((p) => p.slug === category);
  }

  if (minPrice > 0) {
    products = products.filter((p) => p.price >= minPrice);
  }

  if (maxPrice < Infinity) {
    products = products.filter((p) => p.price <= maxPrice);
  }

  switch (sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "name":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      products.sort((a, b) => b.id - a.id);
      break;
  }

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
      keywords: body.keywords || [],
    });

    return Response.json(product, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
