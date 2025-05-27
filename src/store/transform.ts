import { createTransform } from 'redux-persist';
// Adjust path as needed

// Extend CartState with expiresAt for persistence purposes only
type PersistedCartState = CartState & { expiresAt?: number };

export const expireTransform = createTransform<CartState, PersistedCartState>(
  (inboundState) => ({
    ...inboundState,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
  }),

  (outboundState) => {
    const { expiresAt, ...rest } = outboundState;
    if (expiresAt && Date.now() > expiresAt) {
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
        appliedPromo: null,
        discountAmount: 0,
        isOpen: false,
        lastSynced: null,
        status: 'idle',
        error: null,
      };
    }

    return rest as CartState;
  },
  { whitelist: ['cart'] }
);

