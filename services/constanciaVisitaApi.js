import { apiSlice } from "../store/apiSlice";

export const constanciaVisitaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postConstanciaVisita: builder.mutation({
      query: (data) => ({
        url: "excel/generate-visit-excel",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Constancia-visita"],
    }),
  }),
  overrideExisting: true,
});

export const { usePostConstanciaVisitaMutation } = constanciaVisitaApi;
