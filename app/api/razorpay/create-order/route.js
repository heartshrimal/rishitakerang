import Razorpay from "razorpay";
import { addPayment } from "@/lib/store";

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
      notes: { productName, productId: String(productId) },
    });

    const payment = await addPayment({
      name,
      phone,
      utr: "",
      product_name: productName,
      product_price: Number(productPrice),
      product_id: productId ? Number(productId) : null,
      razorpay_order_id: razorpayOrder.id,
      status: "pending",
    });

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
