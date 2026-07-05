import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const PAYMENTS_FILE = path.join(process.cwd(), "data", "store", "payments.json");

async function readPayments() {
  try {
    const data = await readFile(PAYMENTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writePayments(payments) {
  await mkdir(path.dirname(PAYMENTS_FILE), { recursive: true });
  await writeFile(PAYMENTS_FILE, JSON.stringify(payments, null, 2));
}

export async function GET() {
  const payments = await readPayments();
  return Response.json(payments);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, utr, productName, productPrice, productId } = body;

    if (!name || !phone || !utr) {
      return Response.json({ error: "Name, phone, and UTR are required" }, { status: 400 });
    }

    const payments = await readPayments();
    const payment = {
      id: Date.now(),
      name,
      phone,
      utr,
      productName,
      productPrice,
      productId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    payments.push(payment);
    await writePayments(payments);

    return Response.json(payment, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
