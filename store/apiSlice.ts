import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const tagTypes = ["User", "Constancia-visita", "File", "Kinds"];

const getLocalHost = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (!debuggerHost) return "http://localhost:3001";
  const ip = debuggerHost.split(":")[0];
  return `http://${ip}:3001`;
};

const baseQuery = fetchBaseQuery({
  baseUrl: getLocalHost(),
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes,
  endpoints: () => ({}),
});
