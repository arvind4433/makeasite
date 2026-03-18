import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseAPI";

export const AuthAPI = createApi({

  reducerPath: "AuthAPI",

  baseQuery,

  endpoints: (builder) => ({

    login: builder.mutation({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body
      })
    }),

    register: builder.mutation({
      query: (body) => ({
        url: "/api/auth/register",
        method: "POST",
        body
      })
    }),

    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body
      })
    }),

    verifyContactOtp: builder.mutation({
      query: (body) => ({
        url: "/api/auth/verify-contact-otp",
        method: "POST",
        body
      })
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body
      })
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body
      })
    }),

    profile: builder.query({
      query: () => "/api/auth/profile"
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/api/auth/profile",
        method: "PUT",
        body
      })
    }),

    sendProfileOtp: builder.mutation({
      query: (body) => ({
        url: "/api/auth/profile/send-otp",
        method: "POST",
        body
      })
    }),

    verifyProfileOtp: builder.mutation({
      query: (body) => ({
        url: "/api/auth/profile/verify-otp",
        method: "POST",
        body
      })
    }),

    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/api/auth/profile/avatar",
        method: "POST",
        body: formData
      })
    })

  })

});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useVerifyContactOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useProfileQuery,
  useUpdateProfileMutation,
  useSendProfileOtpMutation,
  useVerifyProfileOtpMutation,
  useUploadAvatarMutation
} = AuthAPI;
