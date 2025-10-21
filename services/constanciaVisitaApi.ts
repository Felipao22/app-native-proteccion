import { apiSlice } from "../store/apiSlice";

export interface constanciaVisita {
  empresa: string;
  cuit: number | string;
  provincia: string;
  localidad: string;
  fechaVisita: string;
  direccion: string;
  botiquines: boolean;
  extintores: boolean;
  luces: boolean;
  maquinas: boolean;
  tableros: boolean;
  epp: boolean;
  vehiculos: boolean;
  arneses: boolean;
  escaleras: boolean;
  inspeccion: boolean;
  relevamiento: boolean;
  capacitacion: boolean;
  otros: boolean;
  inputOtros: string;
  areas: string;
  notas: string;
  documentacion: string;
}

export interface responseConstancia {
  message: string;
  excelPath: string;
  pdfPath: string;
}
export const constanciaVisitaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postConstanciaVisita: builder.mutation<
      responseConstancia,
      constanciaVisita
    >({
      query: (data: constanciaVisita) => ({
        url: "excel/generate-visit-excel",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["File"],
    }),
  }),
  overrideExisting: true,
});

export const { usePostConstanciaVisitaMutation } = constanciaVisitaApi;
