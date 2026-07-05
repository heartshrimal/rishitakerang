import { getAllPayments, addPayment } from "@/lib/store";

export async function GET() {
  const payments = await getAllPayments();
  return Response.json(payments);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, utr, productName, productPrice, productId } = body;

    if (!name || !phone) {
      return Response.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const payment = await addPayment({
      name,
      phone,
      utr: utr || "",
      product_name: productName,
      product_price: Number(productPrice),
      product_id: productId ? Number(productId) : null,
      status: "pending",
    });

    return Response.json(payment, { status: 201 });
  } catch (error) {
    console.error("create payment error:", error);
    return Response.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
