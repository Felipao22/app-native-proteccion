import { apiSlice } from "../store/apiSlice";
import type { File } from "./usuariosApi";

export interface Kind {
  id: string;
  name: string;
  categoryId: number;
}

export interface FileResponse {
  message: string;
  pagination: pagination;
  data: File[];
}

export interface filterFileResponse {
  message: string;
  filrtersApplied: filtersApplied;
  pagination: pagination;
  data: File[];
}

export interface filtersApplied {
  startDate?: string;
  endDate?: string;
  userId?: string;
  kindId?: string;
  page?: number;
}
export interface pagination {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export type GetFilesArg = { name?: string; page?: number};

export const filesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFiles: builder.query<FileResponse, GetFilesArg | void>({
      query: (arg) => {
        const page = arg && typeof arg === "object" ? (arg.page ?? 1) : 1;
        const rawName = arg && typeof arg === "object" ? arg.name : undefined;
        const name =
          rawName && typeof rawName === "string" && rawName.trim() !== ""
            ? rawName.trim()
            : undefined;

        const params = new URLSearchParams();
        params.set("page", String(page));
        if (name !== undefined) params.set("name", name);
        return `/file?${params.toString()}`;
      },
      providesTags: ["File"],
    }),
    getKindsFiles: builder.query<Kind[], void>({
      query: () => "/kind",
      providesTags: ["Kinds"],
      transformResponse: (response: Kind[] | { data: Kind[] }): Kind[] => {
        if (Array.isArray(response)) return response;
        if (response && typeof response === "object" && "data" in response) {
          const data = (response as { data: Kind[] }).data;
          return Array.isArray(data) ? data : [];
        }
        return [];
      },
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
    postFilterFiles: builder.mutation<filterFileResponse, filtersApplied>({
      query: (filters) => ({
        url: "/file/filter",
        method: "POST",
        body: filters,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFilesQuery,
  useGetKindsFilesQuery,
  useLazyGetFilesByKindIdQuery,
  usePostDeleteFileByIdMutation,
  usePostFilterFilesMutation,
} = filesApi;
