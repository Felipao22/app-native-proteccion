import { apiSlice } from "../store/apiSlice";
import type { File } from "./usuariosApi";

export interface Kind {
  id: string;
  name: string;
  categoryId: number;
}

export const filesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFiles: builder.query<File[], void>({
      query: () => "/file",
      providesTags: ["File"],
    }),
    getKindsFiles: builder.query<Kind, void>({
      query: () => "/kind",
      providesTags: ["Kinds"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetFilesQuery, useGetKindsFilesQuery } = filesApi;
