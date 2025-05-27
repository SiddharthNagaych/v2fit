import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId: rawUserId,
    } = await req.json();

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !rawUserId) {
      console.error("❌ Missing required fields");
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Signature mismatch");
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const userId = new ObjectId(rawUserId);
    const userIdStr = userId.toHexString();

    // Fetch cart
   const cart = await prisma.cart.findUnique({
  where: { userId: userIdStr },
  include: { items: true },
});


    if (!cart || cart.items.length === 0) {
      console.error("❌ Cart not found or empty", { userId: userIdStr });
      return NextResponse.json({ error: "Cart is empty or not found" }, { status: 400 });
    }

    // Create payment
    await prisma.payment.create({
      data: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        userId: userIdStr,
        amount: cart.totalAmount,
      },
    });

    // Create purchased programs
    const purchaseData = cart.items.map((item) => ({
      userId: userIdStr,
      programId: item.productId,
    }));

    await prisma.purchasedProgram.createMany({
      data: purchaseData,
    });

    // Clear the cart
    await prisma.cart.update({
      where: { userId: userIdStr },
      data: {
        items: { deleteMany: {} },
        totalItems: 0,
        totalAmount: 0,
        appliedPromo: null,
        discountAmount: 0,
      },
    });

    console.log("✅ Payment and purchase completed");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
