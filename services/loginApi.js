import { apiSlice } from "../store/apiSlice";

export const loginApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postLogin: builder.mutation({
      query: (data) => ({
        url: "user/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    postLogOut: builder.mutation({
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

export const { usePostLoginMutation, usePostLogOutMutation } = loginApi;
