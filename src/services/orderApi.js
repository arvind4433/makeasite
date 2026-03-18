import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseAPI.js';

export const OrderAPI = createApi({
  reducerPath: 'OrderAPI',
  baseQuery,
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: () => '/api/orders/myorders',
      providesTags: ['Order']
    }),
    getOrderById: builder.query({
      query: (orderId) => `/api/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }]
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: '/api/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order']
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/orders/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order']
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useDeleteOrderMutation,
} = OrderAPI;
