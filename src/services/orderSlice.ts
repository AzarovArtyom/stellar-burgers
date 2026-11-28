import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi } from '../utils/burger-api';

import type { TOrder } from '../utils/types';
import type { SerializedError } from '@reduxjs/toolkit';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: SerializedError | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
};

export const createOrder = createAsyncThunk('order/createOrder', orderBurgerApi);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error;
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
