import { apiSlice } from "../store/apiSlice";

export const loginApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    posLogin: builder.mutation({
      query: (data) => ({
        url: "user/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    posLogOut: builder.mutation({
      query: (data) => ({
        url: "user/logout",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const { usePosLoginMutation, usePosLogOutMutation } = loginApi;
