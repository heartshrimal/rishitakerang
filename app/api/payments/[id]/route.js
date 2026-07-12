import { getPaymentById, updatePayment } from "@/lib/store";
import { sendAdminNotification } from "@/lib/email";

export async function GET(request, { params }) {
  const { id } = await params;
  const payment = await getPaymentById(id);

  if (!payment) {
    return Response.json({ error: "Payment not found" }, { status: 404 });
  }

  return Response.json(payment);
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const status = body.status || "in_the_making";

    const payment = await updatePayment(id, { status });

    sendAdminNotification(payment);

    return Response.json(payment);
  } catch {
    return Response.json({ error: "Payment not found" }, { status: 404 });
  }
}
