import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { getPaymentById, updatePayment } from "@/lib/store";
import { sendAdminNotification } from "@/lib/email";

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

    const payment = await updatePayment(paymentId, {
      status: "confirmed",
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    });

    sendAdminNotification(payment);

    return Response.json({ success: true, payment });
  } catch (error) {
    console.error("verify error:", error);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
