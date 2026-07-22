import Razorpay from "razorpay";
import { addPayment } from "@/lib/store";
import { sendAdminNotification } from "@/lib/email";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, address } = body;

    if (!name || !phone) {
      return Response.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const isCart = Array.isArray(body.cartItems) && body.cartItems.length > 0;
    const isCustom = !isCart && body.productName && !body.productId;

    let productName, productPrice, productId, products, shipping, total;

    if (isCart) {
      const cartItems = body.cartItems;
      productName = `Cart (${cartItems.length} items)`;
      productPrice = cartItems.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
      productId = null;
      products = cartItems.map((i) => ({
        id: i.id,
        name: i.name,
        price: Number(i.price),
        quantity: i.quantity,
        customizations: i.customizations || null,
      }));
      shipping = productPrice > 2000 ? 0 : 100;
    } else if (isCustom) {
      productName = body.productName;
      productPrice = Number(body.productPrice);
      productId = null;
      products = [{
        id: null,
        name: productName,
        price: productPrice,
        quantity: 1,
        customizations: body.customizations || null,
      }];
      shipping = productPrice >= 2000 ? 0 : 100;
    } else {
      const { productId: pid, productName: pName, productPrice: pPrice } = body;
      productId = pid ? Number(pid) : null;
      productName = pName;
      productPrice = Number(pPrice);
      products = [{ id: productId, name: productName, price: productPrice, quantity: 1 }];
      shipping = Number(productPrice) >= 2000 || Number(productPrice) <= 1 ? 0 : 100;
    }

    total = productPrice + shipping;
    const amountInPaise = Math.round(total * 100);

    let razorpayOrder = null;
    if (amountInPaise > 0) {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `order_${Date.now()}`,
        notes: { productName, productId: String(productId || "") },
      });
    }

    const payment = await addPayment({
      name,
      phone,
      email: email || "",
      address: address || "",
      shipping,
      utr: "",
      product_name: productName,
      product_price: productPrice,
      product_id: productId,
      products,
      razorpay_order_id: razorpayOrder?.id || "",
      status: amountInPaise === 0 ? "confirmed" : "pending",
    });

    if (amountInPaise === 0) {
      sendAdminNotification(payment);
    }

    return Response.json({
      id: payment.id,
      razorpayOrderId: razorpayOrder?.id || null,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amountInPaise,
    });
  } catch (error) {
    console.error("create-order error:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
