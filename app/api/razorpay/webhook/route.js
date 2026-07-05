import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

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

export async function POST(request) {
  try {
    const text = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    if (signature !== expectedSignature) {
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(text);
    const event = payload.event;

    if (event === "payment.captured") {
      const payment = payload.payload.payment.entity;
      const orderId = payment.order_id;

      const payments = await readPayments();
      const index = payments.findIndex((p) => p.razorpayOrderId === orderId);

      if (index !== -1 && payments[index].status !== "confirmed") {
        payments[index].status = "confirmed";
        payments[index].razorpayPaymentId = payment.id;
        await writePayments(payments);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("webhook error:", error);
    return Response.json({ error: "Webhook failed" }, { status: 500 });
  }
}
