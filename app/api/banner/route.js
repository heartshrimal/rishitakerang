import { verifyToken } from "@/lib/auth";
import { getBannerItems, addBannerItem, updateBannerItem, deleteBannerItem } from "@/lib/store";

export async function GET() {
  const items = await getBannerItems();
  return Response.json(items);
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
    const { action, id, text, position } = body;

    if (action === "add") {
      const items = await getBannerItems();
      const nextPos = items.length > 0 ? Math.max(...items.map((i) => i.position)) + 1 : 0;
      const item = await addBannerItem(text || "", nextPos);
      return Response.json(item, { status: 201 });
    }

    if (action === "update") {
      const item = await updateBannerItem(id, text);
      return Response.json(item);
    }

    if (action === "delete") {
      await deleteBannerItem(id);
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
