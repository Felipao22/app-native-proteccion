import { apiSlice } from "../store/apiSlice";

export const usuariosApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `/user`,
      method: "GET",
      providesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetUsersQuery } = usuariosApi;
