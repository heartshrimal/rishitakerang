import { SignJWT, jwtVerify } from "jose";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
