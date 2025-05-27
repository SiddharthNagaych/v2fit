"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, store } from "@/store";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Star,
  Clock,
  ArrowLeft,
  CreditCard,
  Lock,
  Tag,
  CheckCircle,
  Gift,
  X,
} from "lucide-react";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromoCode,
  removePromoCode,
} from "@/store/slices/cartSlice";
import { useSession } from "next-auth/react";

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = useSelector((state: RootState) => state.cart.totalAmount);
  const appliedPromo = useSelector(
    (state: RootState) => state.cart.appliedPromo
  );
  const discountAmount = useSelector(
    (state: RootState) => state.cart.discountAmount
  );

  const [promoCode, setPromoCode] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const savings = originalTotal - subtotal;
  const finalTotal = subtotal - discountAmount;

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(id));
      return;
    }
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleApplyPromo = () => {
    dispatch(applyPromoCode(promoCode));
    setPromoCode("");
  };

  const handleRemovePromo = () => {
    dispatch(removePromoCode());
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true); // Already loaded
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const checkoutHandler = async (amount: number, userEmail: string) => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    try {
      // First, sync the local cart to database
      const cartState = store.getState().cart;
      
      const syncResponse = await fetch('/api/cart/sync-for-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartState.items,
          totalItems: cartState.totalItems,
          totalAmount: cartState.totalAmount,
          appliedPromo: cartState.appliedPromo,
          discountAmount: cartState.discountAmount
        })
      });

      if (!syncResponse.ok) {
        throw new Error('Failed to sync cart');
      }

      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amount) }), // Razorpay uses paise
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Failed to create Razorpay order");
      }

      const { order } = await orderResponse.json();
      
      if (!session || !session.user?.id || !session.user?.email) {
        alert("Please sign in to complete your purchase");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "FitApp",
        description: "Purchase Program",
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: session.user?.id,
              }),
            });

            const data = await verifyRes.json();
            if (data.success) {
              window.location.href = "/purchase-success";
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification error. Please contact support.");
          }
        },
        prefill: {
          name: session.user?.name || "",
          email: session.user?.email || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            console.log("Checkout closed by user");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout failed", err);
      throw err; // Re-throw to handle in the calling function
    }
  };

  const handleCheckout = async () => {
    if (!session?.user?.email) {
      alert("Please sign in to complete your purchase");
      return;
    }

    setIsCheckingOut(true);
    try {
      await checkoutHandler(finalTotal, session.user.email);
      dispatch(clearCart());
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-6">
          <ShoppingCart className="mx-auto w-16 h-16 text-slate-400" />
          <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
          <p className="text-slate-400">
            Browse our programs to start your fitness journey.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-rose-500 rounded-lg text-white hover:bg-rose-600 transition"
          >
            Browse Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 p-4 rounded-lg flex justify-between"
            >
              <div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-slate-400 text-sm">by {item.instructor}</p>
                <p className="text-sm mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-rose-400 font-bold">
                  {(item.price * item.quantity).toFixed(0)}
                </p>
                {item.originalPrice && (
                  <p className="text-slate-500 line-through text-sm">
                    {(item.originalPrice * item.quantity).toFixed(0)}
                  </p>
                )}
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    className="text-white bg-slate-700 p-1 rounded hover:bg-slate-600"
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    className="text-white bg-slate-700 p-1 rounded hover:bg-slate-600"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Promo Code</h3>
            {appliedPromo ? (
              <div className="flex justify-between items-center text-green-400">
                <span>{appliedPromo}</span>
                <button onClick={handleRemovePromo}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={!promoCode}
                  className="w-full bg-slate-600 hover:bg-slate-500 px-3 py-2 rounded disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-800 p-4 rounded-lg space-y-2">
            <h3 className="font-bold">Order Summary</h3>
            <div className="flex justify-between text-sm text-slate-400">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(0)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Savings</span>
                <span>-{savings.toFixed(0)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Promo Discount</span>
                <span>-{discountAmount.toFixed(0)}</span>
              </div>
            )}
            <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{finalTotal.toFixed(0)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut || !session?.user}
            className="w-full bg-gradient-to-r from-rose-500 to-slate-500 px-4 py-3 rounded-lg text-white font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {isCheckingOut ? "Processing..." : "Pay with Razorpay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;