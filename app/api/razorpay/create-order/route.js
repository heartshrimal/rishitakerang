import Razorpay from "razorpay";
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

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { productId, productName, productPrice, name, phone } = await request.json();

    if (!name || !phone) {
      return Response.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const amountInPaise = Math.round(Number(productPrice) * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        productName,
        productId: String(productId),
      },
    });

    const payments = await readPayments();
    const payment = {
      id: Date.now(),
      name,
      phone,
      utr: "",
      productName,
      productPrice: Number(productPrice),
      productId,
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    payments.push(payment);
    await writePayments(payments);

    return Response.json({
      id: payment.id,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amountInPaise,
    });
  } catch (error) {
    console.error("create-order error:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
