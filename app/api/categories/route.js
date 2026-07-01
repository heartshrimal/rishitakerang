import { verifyToken } from "@/lib/auth";
import { getAllCategories, addCategory } from "@/lib/store";

export async function GET() {
  const categories = getAllCategories();
  return Response.json(categories);
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
    const category = {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
      icon: body.icon || "📦",
      description: body.description || "",
    };

    addCategory(category);
    return Response.json(category, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
