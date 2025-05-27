// store/transforms.ts
import { createTransform } from 'redux-persist';

export const expireTransform = createTransform(
  (inboundState: any, key) => {
    return {
      ...inboundState,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    };
  },
  (outboundState: any, key) => {
    if (outboundState.expiresAt && Date.now() > outboundState.expiresAt) {
      return { items: [], total: 0 }; // Clear expired cart
    }
    return outboundState;
  },
  { whitelist: ['cart'] }
);