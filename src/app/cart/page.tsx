"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, store } from "@/store";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  X,
  User,
  LogIn,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
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

// Error types for better error handling
enum ErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  PAYMENT_ERROR = "PAYMENT_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTH_ERROR = "AUTH_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
}

interface PaymentError {
  type: ErrorType;
  message: string;
  retryable: boolean;
}

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();
  const router = useRouter();

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
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [showRetryOptions, setShowRetryOptions] = useState(false);

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const savings = originalTotal - subtotal;
  const finalTotal = subtotal - discountAmount;

  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 1000; // 1 second

  // In your CartPage component, update the categorizeError function:
  const categorizeError = (error: unknown): PaymentError => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const message = errorObj.message || "An unexpected error occurred";

    // Check for specific API error codes
    if (message.includes("UNAUTHORIZED") || message.includes("AUTH_ERROR")) {
      return {
        type: ErrorType.AUTH_ERROR,
        message: "Please sign in to continue with your purchase.",
        retryable: false,
      };
    }

    if (message.includes("VALIDATION_ERROR")) {
      return {
        type: ErrorType.VALIDATION_ERROR,
        message: "Cart data is invalid. Please refresh and try again.",
        retryable: false,
      };
    }

    if (message.includes("DB_ERROR") || message.includes("DATABASE")) {
      return {
        type: ErrorType.SERVER_ERROR,
        message: "Database connection failed. Please try again.",
        retryable: true,
      };
    }

    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("Failed to fetch")
    ) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: "Network error. Please check your connection.",
        retryable: true,
      };
    }

    return {
      type: ErrorType.PAYMENT_ERROR,
      message: message,
      retryable: true,
    };
  };

  // Utility function for delay
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Enhanced error notification component
  const ErrorNotification = ({
    error,
    onRetry,
    onDismiss,
  }: {
    error: PaymentError;
    onRetry?: () => void;
    onDismiss: () => void;
  }) => (
    <div className="fixed top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">Payment Error</h4>
          <p className="text-sm text-red-100 mt-1">{error.message}</p>
          {error.retryable && onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs mt-2 transition"
            >
              Try Again
            </button>
          )}
        </div>
        <button onClick={onDismiss} className="text-red-200 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

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

  // Enhanced checkout handler with retry mechanism
  const checkoutHandler = async (
    amount: number,
    currentRetryCount = 0
  ): Promise<void> => {
    try {
      console.log(
        `Checkout attempt ${currentRetryCount + 1}/${MAX_RETRY_ATTEMPTS + 1}`
      );

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error(
          "Failed to load Razorpay SDK. Please refresh and try again."
        );
      }

      // Validate session
      if (!session?.user?.id || !session?.user?.email) {
        throw new Error(
          "Authentication required. Please sign in to complete your purchase."
        );
      }

      // Sync cart with server
      const cartState = store.getState().cart;
      console.log("Syncing cart state:", cartState);

      const syncResponse = await fetch("/api/cart/sync-for-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(cartState),
      });
      console.log("Cart sync response:", syncResponse.status);
      console.log(
        "Sync response headers:",
        Object.fromEntries(syncResponse.headers.entries())
      );

      if (!syncResponse.ok) {
        const syncError = await syncResponse.json().catch((e) => {
          console.error("Failed to parse sync error response:", e);
          return { message: `HTTP ${syncResponse.status}` };
        });

        console.error("Sync error details:", syncError);
        throw new Error(
          `Cart sync failed: ${
            syncError.message ||
            syncError.error ||
            `HTTP ${syncResponse.status}`
          }`
        );
      }

      const syncData = await syncResponse.json();
      console.log("Cart sync successful:", syncData);

      // Create Razorpay order
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ amount: Math.round(amount) }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(
          `Order creation failed: ${
            errorData.message || `HTTP ${orderResponse.status}`
          }`
        );
      }

      const { order }: { order: RazorpayOrder } = await orderResponse.json();
      console.log("Razorpay order created:", order);

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "FitApp",
        description: "Purchase Program",
        image: "/favicon-96x96.png",
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            console.log("Payment successful, verifying:", response);

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
              console.log("Payment verified successfully");
              // Only clear cart after successful verification
              dispatch(clearCart());
              window.location.href = "/schedule";
            } else {
              throw new Error(
                "Payment verification failed. Please contact support."
              );
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            setPaymentError(categorizeError(err));
            setShowRetryOptions(true);
          }
        },
        prefill: {
          name: session.user.name || "",
          email: session.user.email || "",
        },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: () => {
            console.log("Payment modal closed by user");
            setIsCheckingOut(false);
          },
        },
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

      // Reset error states on successful initialization
      setPaymentError(null);
      setRetryAttempt(0);
    } catch (error: unknown) {
      console.error(`Checkout attempt ${currentRetryCount + 1} failed:`, error);

      const categorizedError = categorizeError(error);

      // Check if we should retry
      if (
        categorizedError.retryable &&
        currentRetryCount < MAX_RETRY_ATTEMPTS
      ) {
        console.log(
          `Retrying in ${RETRY_DELAY}ms... (attempt ${
            currentRetryCount + 1
          }/${MAX_RETRY_ATTEMPTS})`
        );
        setRetryAttempt(currentRetryCount + 1);

        await delay(RETRY_DELAY * (currentRetryCount + 1)); // Exponential backoff
        return checkoutHandler(amount, currentRetryCount + 1);
      } else {
        // Max retries reached or non-retryable error
        setPaymentError(categorizedError);
        setShowRetryOptions(categorizedError.retryable);
        throw error;
      }
    }
  };

  const handleCheckout = async () => {
    if (!session?.user?.email) {
      setPaymentError({
        type: ErrorType.AUTH_ERROR,
        message: "Please sign in to complete your purchase",
        retryable: false,
      });
      return;
    }

    setIsCheckingOut(true);
    setPaymentError(null);
    setRetryAttempt(0);
    setShowRetryOptions(false);

    try {
      await checkoutHandler(finalTotal);
    } catch (error) {
      console.error("Final checkout error:", error);
      // Error is already set in checkoutHandler
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleRetryPayment = () => {
    setPaymentError(null);
    setShowRetryOptions(false);
    handleCheckout();
  };

  const dismissError = () => {
    setPaymentError(null);
    setShowRetryOptions(false);
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
            onClick={() => router.push("/programs")}
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
                Please sign in to your account to proceed with checkout and
                complete your purchase.
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
      {/* Error Notification */}
      {paymentError && (
        <ErrorNotification
          error={paymentError}
          onRetry={showRetryOptions ? handleRetryPayment : undefined}
          onDismiss={dismissError}
        />
      )}

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.title}`}
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
                <button
                  onClick={handleRemovePromo}
                  className="hover:text-green-300"
                >
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

          {/* Checkout Button with enhanced states */}
          <div className="space-y-2">
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-gradient-to-r from-rose-500 to-slate-500 px-4 py-3 rounded-lg text-white font-bold hover:scale-105 transition transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {isCheckingOut ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {retryAttempt > 0
                    ? `Retrying... (${retryAttempt}/${MAX_RETRY_ATTEMPTS})`
                    : "Processing..."}
                </div>
              ) : (
                "Pay with Razorpay"
              )}
            </button>

            {/* Retry information */}
            {retryAttempt > 0 && isCheckingOut && (
              <p className="text-xs text-slate-400 text-center">
                Attempting to connect... Please wait
              </p>
            )}
          </div>

          {/* Security notice */}
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Secure Payment via Razorpay</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
