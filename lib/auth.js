import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

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

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
