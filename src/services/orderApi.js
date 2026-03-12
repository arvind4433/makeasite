import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseAPI.js';

export const OrderAPI = createApi({
  reducerPath: 'OrderAPI',
  baseQuery,
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: () => '/orders/myorders',
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  useDeleteOrderMutation,
} = OrderAPI;
