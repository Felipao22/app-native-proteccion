import { apiSlice } from "../store/apiSlice";

export interface Users {
  userId: string;
  email: string;
  name: any | string;
  lastName: any | string;
  password: string;
  nombreEmpresa: string;
  cuit: string;
  nombreSede: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  emails: any[];
  accessUser: any[];
  emailJefe: string;
  deleted: boolean;
  active: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  files: File[];
}

export interface File {
  id: string;
  type: string;
  name: string;
  data: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  kindId: string;
  userEmail: string;
}

export const usuariosApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<Users[], void>({
      query: () => `/user`,
      providesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetUsersQuery } = usuariosApi;
