import { supabase } from "@/lib/supabase";
import crypto from "crypto";

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

      const { data: existing } = await supabase
        .from("payments")
        .select("id, status")
        .eq("razorpay_order_id", orderId)
        .single();

      if (existing && existing.status !== "confirmed") {
        await supabase
          .from("payments")
          .update({ status: "confirmed", razorpay_payment_id: payment.id })
          .eq("id", existing.id);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("webhook error:", error);
    return Response.json({ error: "Webhook failed" }, { status: 500 });
  }
}
