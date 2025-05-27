// app/api/razorpay/order/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { amount, currency = "INR", receipt = "receipt#1" } = await req.json();

  const options = {
    amount: Math.round(amount * 100), // in paise
    currency,
    receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json({ order });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
