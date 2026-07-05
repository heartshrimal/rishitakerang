import { verifyToken } from "@/lib/auth";
import { getBannerItems, updateBannerItems } from "@/lib/store";

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
    if (!Array.isArray(body.items)) {
      return Response.json({ error: "items must be an array" }, { status: 400 });
    }
    const items = await updateBannerItems(body.items);
    return Response.json(items);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
