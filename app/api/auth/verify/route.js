import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ valid: false }, { status: 401 });
  }

  const token = auth.slice(7);
  const valid = await verifyToken(token);

  if (!valid) {
    return Response.json({ valid: false }, { status: 401 });
  }

  return Response.json({ valid: true });
}
