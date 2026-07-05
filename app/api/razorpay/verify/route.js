import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
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

export async function POST(request) {
  try {
    const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await request.json();

    const isValid = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      razorpaySignature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!isValid) {
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payments = await readPayments();
    const index = payments.findIndex((p) => p.id === Number(paymentId));

    if (index === -1) {
      return Response.json({ error: "Payment not found" }, { status: 404 });
    }

    payments[index].status = "confirmed";
    payments[index].razorpayPaymentId = razorpayPaymentId;
    payments[index].razorpaySignature = razorpaySignature;
    await writePayments(payments);

    sendAdminNotification(payments[index]);

    return Response.json({ success: true, payment: payments[index] });
  } catch (error) {
    console.error("verify error:", error);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
