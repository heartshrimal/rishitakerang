import { verifyToken } from "@/lib/auth";
import { getProductById, updateProduct, deleteProduct } from "@/lib/store";

async function authorize(request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return false;
  return verifyToken(auth.slice(7));
}

export async function PUT(request, { params }) {
  if (!(await authorize(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getProductById(id);
  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updated = {};

    if (body.name !== undefined) updated.name = body.name;
    if (body.category !== undefined) updated.category = body.category;
    if (body.slug !== undefined) updated.slug = body.slug;
    if (body.price !== undefined) updated.price = Number(body.price);
    if (body.images !== undefined) {
      updated.image = body.images[0] || existing.image;
      updated.images = body.images;
    }
    if (body.description !== undefined) updated.description = body.description;
    if (body.details !== undefined) updated.details = body.details;
    if (body.featured !== undefined) updated.featured = body.featured;

    const product = await updateProduct(id, updated);
    return Response.json(product);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  if (!(await authorize(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await deleteProduct(id);
  return Response.json({ success: true });
}
