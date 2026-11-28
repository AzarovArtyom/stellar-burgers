import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi } from '../utils/burger-api';

import type { TOrder } from '../utils/types';

type TOrderDetailsState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderDetailsState = {
  order: null,
  isLoading: false,
  error: null,
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderDetails/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];

    if (!order) {
      throw new Error('Заказ не найден');
    }

    return order;
  }
);

export const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.order = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      });
  },
});

export default orderDetailsSlice.reducer;
