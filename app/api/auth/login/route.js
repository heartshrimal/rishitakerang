import { createToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createToken();

    return Response.json({ token });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
