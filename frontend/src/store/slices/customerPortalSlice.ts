import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerProduct } from '@services/customer.api';

export interface CustomerCartItem {
  product: CustomerProduct;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  title: string;
  discountPercent?: number;
  discountAmount?: number;
}

interface CustomerPortalState {
  cart: CustomerCartItem[];
  wishlist: CustomerProduct[];
  selectedBranch: string;
  deliveryType: 'Delivery' | 'Pickup';
  selectedAddress: string;
  appliedCoupon: AppliedCoupon | null;
  pointsToRedeem: number;
  loyaltyPointsBalance: number;
  searchQuery: string;
  selectedCategory: string;
}

const loadSavedCart = (): CustomerCartItem[] => {
  try {
    const saved = localStorage.getItem('customer_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const loadSavedWishlist = (): CustomerProduct[] => {
  try {
    const saved = localStorage.getItem('customer_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: CustomerPortalState = {
  cart: loadSavedCart(),
  wishlist: loadSavedWishlist(),
  selectedBranch: 'Kisii Main Branch',
  deliveryType: 'Delivery',
  selectedAddress: 'Milimani Estate, House #14, Kisii',
  appliedCoupon: null,
  pointsToRedeem: 0,
  loyaltyPointsBalance: 2450,
  searchQuery: '',
  selectedCategory: 'all',
};

const customerPortalSlice = createSlice({
  name: 'customerPortal',
  initialState,
  reducers: {
    addToCustomerCart: (state, action: PayloadAction<{ product: CustomerProduct; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }
      localStorage.setItem('customer_cart', JSON.stringify(state.cart));
    },
    removeFromCustomerCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter((item) => item.product.id !== action.payload);
      localStorage.setItem('customer_cart', JSON.stringify(state.cart));
    },
    updateCustomerCartQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const item = state.cart.find((i) => i.product.id === action.payload.productId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.cart = state.cart.filter((i) => i.product.id !== action.payload.productId);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      localStorage.setItem('customer_cart', JSON.stringify(state.cart));
    },
    clearCustomerCart: (state) => {
      state.cart = [];
      state.appliedCoupon = null;
      state.pointsToRedeem = 0;
      localStorage.removeItem('customer_cart');
    },
    toggleWishlist: (state, action: PayloadAction<CustomerProduct>) => {
      const exists = state.wishlist.some((p) => p.id === action.payload.id);
      if (exists) {
        state.wishlist = state.wishlist.filter((p) => p.id !== action.payload.id);
      } else {
        state.wishlist.push(action.payload);
      }
      localStorage.setItem('customer_wishlist', JSON.stringify(state.wishlist));
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.wishlist = state.wishlist.filter((p) => p.id !== action.payload);
      localStorage.setItem('customer_wishlist', JSON.stringify(state.wishlist));
    },
    setSelectedBranch: (state, action: PayloadAction<string>) => {
      state.selectedBranch = action.payload;
    },
    setDeliveryType: (state, action: PayloadAction<'Delivery' | 'Pickup'>) => {
      state.deliveryType = action.payload;
    },
    setSelectedAddress: (state, action: PayloadAction<string>) => {
      state.selectedAddress = action.payload;
    },
    applyCoupon: (state, action: PayloadAction<AppliedCoupon | null>) => {
      state.appliedCoupon = action.payload;
    },
    setPointsToRedeem: (state, action: PayloadAction<number>) => {
      state.pointsToRedeem = action.payload;
    },
    updateLoyaltyBalance: (state, action: PayloadAction<number>) => {
      state.loyaltyPointsBalance = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const {
  addToCustomerCart,
  removeFromCustomerCart,
  updateCustomerCartQuantity,
  clearCustomerCart,
  toggleWishlist,
  removeFromWishlist,
  setSelectedBranch,
  setDeliveryType,
  setSelectedAddress,
  applyCoupon,
  setPointsToRedeem,
  updateLoyaltyBalance,
  setSearchQuery,
  setSelectedCategory,
} = customerPortalSlice.actions;

export default customerPortalSlice.reducer;
