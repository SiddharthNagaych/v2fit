"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, store } from "@/store";
import { ShoppingCart, Trash2, Plus, Minus, X, User, LogIn } from "lucide-react";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromoCode,
  removePromoCode,
} from "@/store/slices/cartSlice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: { color: string };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();
  const router = useRouter();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = useSelector((state: RootState) => state.cart.totalAmount);
  const appliedPromo = useSelector((state: RootState) => state.cart.appliedPromo);
  const discountAmount = useSelector((state: RootState) => state.cart.discountAmount);

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
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
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

  const handleSignInRedirect = () => {
    router.push("/auth/Sign-In");
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const checkoutHandler = async (amount: number) => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK.");
      return;
    }

    try {
      const cartState = store.getState().cart;

      const syncResponse = await fetch("/api/cart/sync-for-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartState),
      });

      if (!syncResponse.ok) throw new Error("Failed to sync cart");

      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amount) }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Failed to create Razorpay order");
      }

      const { order }: { order: RazorpayOrder } = await orderResponse.json();

      if (!session?.user?.id || !session?.user?.email) {
        alert("Please sign in to complete your purchase");
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "FitApp",
        description: "Purchase Program",
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                userId: session.user.id,
              }),
            });

            const data = await verifyRes.json();
            if (data.success) {
              window.location.href = "/purchase-success";
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification error.");
          }
        },
        prefill: {
          name: session.user.name || "",
          email: session.user.email || "",
        },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: () => console.log("Checkout closed by user"),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  const handleCheckout = async () => {
    if (!session?.user?.email) {
      alert("Please sign in to complete your purchase");
      return;
    }

    setIsCheckingOut(true);
    try {
      await checkoutHandler(finalTotal);
      dispatch(clearCart());
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Empty Cart UI
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-6">
          <ShoppingCart className="mx-auto w-16 h-16 text-slate-400" />
          <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
          <p className="text-slate-400">
            Browse our programs to start your fitness journey.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-lg text-white transition transform hover:scale-105 bg-gradient-to-r from-[#C15364] to-[#858B95] hover:from-[#C15364] hover:to-[#858B95]"
          >
            Browse Programs
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated UI - Show cart items but require sign in for checkout
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
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
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </p>
                  {item.originalPrice && (
                    <p className="text-slate-500 line-through text-sm">
                      ₹{(item.originalPrice * item.quantity).toFixed(0)}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2 justify-end">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="text-white bg-slate-700 p-1 rounded hover:bg-slate-600 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="text-white bg-slate-700 p-1 rounded hover:bg-slate-600 transition"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Sign In Required Notice */}
            <div className="bg-gradient-to-r from-rose-500/20 to-slate-500/20 border border-rose-500/30 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-6 h-6 text-rose-400" />
                <h3 className="font-bold text-rose-400">Sign In Required</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Please sign in to your account to proceed with checkout and complete your purchase.
              </p>
              <button
                onClick={handleSignInRedirect}
                className="w-full bg-gradient-to-r from-rose-500 to-slate-500 px-4 py-3 rounded-lg text-white font-bold hover:scale-105 transition transform flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Sign In to Continue
              </button>
            </div>

            {/* Promo Code Section - Disabled for non-authenticated users */}
            <div className="bg-slate-800 p-4 rounded-lg opacity-75">
              <h3 className="font-bold mb-2 text-slate-400">Promo Code</h3>
              <div className="space-y-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Sign in to apply promo codes"
                  disabled
                  className="w-full px-3 py-2 bg-slate-700 text-slate-500 rounded cursor-not-allowed"
                />
                <button
                  disabled
                  className="w-full bg-slate-600 px-3 py-2 rounded opacity-50 cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-slate-800 p-4 rounded-lg space-y-2">
              <h3 className="font-bold">Order Summary</h3>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Savings</span>
                  <span>-₹{savings.toFixed(0)}</span>
                </div>
              )}
              <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(0)}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                *Sign in to proceed with payment
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user - Full cart functionality
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
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
                  ₹{(item.price * item.quantity).toFixed(0)}
                </p>
                {item.originalPrice && (
                  <p className="text-slate-500 line-through text-sm">
                    ₹{(item.originalPrice * item.quantity).toFixed(0)}
                  </p>
                )}
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    className="text-white bg-slate-700 p-1 rounded hover:bg-slate-600 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    className="text-white bg-slate-700 p-1 rounded hover:bg-slate-600 transition"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar for authenticated users */}
        <div className="space-y-4">
          {/* Promo Code */}
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Promo Code</h3>
            {appliedPromo ? (
              <div className="flex justify-between items-center text-green-400">
                <span>{appliedPromo}</span>
                <button onClick={handleRemovePromo} className="hover:text-green-300">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={!promoCode}
                  className="w-full bg-slate-600 hover:bg-slate-500 px-3 py-2 rounded disabled:opacity-50 transition"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-slate-800 p-4 rounded-lg space-y-2">
            <h3 className="font-bold">Order Summary</h3>
            <div className="flex justify-between text-sm text-slate-400">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Savings</span>
                <span>-₹{savings.toFixed(0)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Promo Discount</span>
                <span>-₹{discountAmount.toFixed(0)}</span>
              </div>
            )}
            <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(0)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full bg-gradient-to-r from-rose-500 to-slate-500 px-4 py-3 rounded-lg text-white font-bold hover:scale-105 transition transform disabled:opacity-50"
          >
            {isCheckingOut ? "Processing..." : "Pay with Razorpay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;