import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '@types/index';

interface CartState {
  items: CartItem[];
  discount: number;
  tax: number;
  customer: string | null;
  paymentMethod: string | null;
  notes: string;
}

const initialState: CartState = {
  items: [],
  discount: 0,
  tax: 16, // 16% VAT
  customer: null,
  paymentMethod: null,
  notes: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.cartQty += 1;
        existing.subtotal = existing.cartQty * existing.price * (1 - existing.discount / 100);
      } else {
        state.items.push({
          ...action.payload,
          cartQty: 1,
          discount: 0,
          subtotal: action.payload.price,
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.cartQty = action.payload.quantity;
        item.subtotal = item.cartQty * item.price * (1 - item.discount / 100);
      }
    },
    updateItemDiscount: (state, action: PayloadAction<{ id: number; discount: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.discount = action.payload.discount;
        item.subtotal = item.cartQty * item.price * (1 - item.discount / 100);
      }
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    setTax: (state, action: PayloadAction<number>) => {
      state.tax = action.payload;
    },
    setCustomer: (state, action: PayloadAction<string | null>) => {
      state.customer = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<string | null>) => {
      state.paymentMethod = action.payload;
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.discount = 0;
      state.customer = null;
      state.paymentMethod = null;
      state.notes = '';
    },
    holdSale: (state) => {
      // Save current cart to local storage for later
      const savedCarts = JSON.parse(localStorage.getItem('heldSales') || '[]');
      savedCarts.push({
        id: Date.now(),
        items: state.items,
        discount: state.discount,
        customer: state.customer,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('heldSales', JSON.stringify(savedCarts));
      // Clear current cart
      state.items = [];
      state.discount = 0;
      state.customer = null;
      state.paymentMethod = null;
      state.notes = '';
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateItemDiscount,
  setDiscount,
  setTax,
  setCustomer,
  setPaymentMethod,
  setNotes,
  clearCart,
  holdSale,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.subtotal, 0);

export const selectCartDiscount = (state: { cart: CartState }) => {
  const subtotal = selectCartSubtotal(state);
  return subtotal * (state.cart.discount / 100);
};

export const selectCartTax = (state: { cart: CartState }) => {
  const subtotal = selectCartSubtotal(state);
  const discount = selectCartDiscount(state);
  return (subtotal - discount) * (state.cart.tax / 100);
};

export const selectCartTotal = (state: { cart: CartState }) => {
  const subtotal = selectCartSubtotal(state);
  const discount = selectCartDiscount(state);
  const tax = selectCartTax(state);
  return subtotal - discount + tax;
};
