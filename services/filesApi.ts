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
    getFiles: builder.query<File[], string | void>({
      query: (name) =>
        name && name.trim() !== "" ? `/file?name=${name}` : "/file",
      providesTags: ["File"],
    }),
    getKindsFiles: builder.query<Kind, void>({
      query: () => "/kind",
      providesTags: ["Kinds"],
    }),
    getFilesByKindId: builder.query<FileResponse, string>({
      query: (kindId) => `/file/kind/${kindId}`,
      providesTags: ["File"],
    }),
    postDeleteFileById: builder.mutation({
      query: (id: string) => ({
        url: `/file/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["File"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFilesQuery,
  useGetKindsFilesQuery,
  useLazyGetFilesByKindIdQuery,
  usePostDeleteFileByIdMutation,
} = filesApi;
