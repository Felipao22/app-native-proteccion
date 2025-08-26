import { apiSlice } from "../store/apiSlice";
import type { File } from "./usuariosApi";

export interface Kind {
  id: string;
  name: string;
  categoryId: number;
}

export interface FileResponse {
  message: string;
  data: File[];
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
    getFilesByKindId: builder.query<File[], string>({
      query: (kindId) => `/file/kind/${kindId}`,
      providesTags: ["File"],
      transformResponse: (response: FileResponse) => response.data,
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFilesQuery,
  useGetKindsFilesQuery,
  useLazyGetFilesByKindIdQuery,
} = filesApi;
