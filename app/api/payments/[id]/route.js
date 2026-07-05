import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { sendAdminNotification } from "@/lib/email";

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

export async function GET(request, { params }) {
  const { id } = await params;
  const payments = await readPayments();
  const payment = payments.find((p) => p.id === Number(id));

  if (!payment) {
    return Response.json({ error: "Payment not found" }, { status: 404 });
  }

  return Response.json(payment);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const payments = await readPayments();
  const index = payments.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return Response.json({ error: "Payment not found" }, { status: 404 });
  }

  payments[index].status = "confirmed";
  await writePayments(payments);

  sendAdminNotification(payments[index]);

  return Response.json(payments[index]);
}
