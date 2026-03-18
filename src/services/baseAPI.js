import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config/api";

const baseQuery = fetchBaseQuery({

 baseUrl: API_BASE_URL,

 prepareHeaders: (headers) => {

  try {
   const stored = localStorage.getItem("userInfo");
   if (stored) {
    const token = JSON.parse(stored)?.token;
    if (token) {
     headers.set("Authorization", `Bearer ${token}`);
    }
   }
  } catch {}

  return headers;
 }

});

export default baseQuery;
