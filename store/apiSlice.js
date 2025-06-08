import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Constants from "expo-constants";

export const tagTypes = ["User"];

// Obtenemos la IP local del host desde el `manifest`
const getLocalHost = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;

  if (!debuggerHost) return "http://localhost:3001"; // fallback

  const ip = debuggerHost.split(":")[0];
  return `http://${ip}:3001`;
};

const baseQuery = fetchBaseQuery({
  baseUrl: getLocalHost(),
  credentials: "include",
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes,
  endpoints: () => ({}),
});
