import * as FileSystem from "expo-file-system";

/**
 * Convierte una firma en data URL (p. ej. desde `react-native-signature-canvas`)
 * en un archivo temporal y lo adjunta al `FormData` con el campo `firma`, listo
 * para envío multipart en React Native.
 *
 * Formatos admitidos en el prefijo MIME: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`.
 * Si `dataUrl` no coincide con el patrón esperado o no hay `FileSystem.cacheDirectory`,
 * la función no modifica `formData`.
 *
 * @param formData - Cuerpo multipart donde se añade la parte `firma`.
 * @param dataUrl - Cadena `data:image/...;base64,...`.
 */
const appendFirmaDataUrlToFormData = async (
    formData: FormData,
    dataUrl: string
  ): Promise<void> => {
    const m = /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/i.exec(dataUrl);
    if (!m) return;
    const mimeRaw = m[1].toLowerCase();
    const base64 = m[2];
    const ext =
      mimeRaw === "image/jpeg" || mimeRaw === "image/jpg"
        ? "jpg"
        : mimeRaw === "image/webp"
          ? "webp"
          : "png";
    const mime =
      mimeRaw === "image/jpg" ? "image/jpeg" : mimeRaw;
    const dir = FileSystem.cacheDirectory;
    if (!dir) return;
    const path = `${dir}firma_${Date.now()}.${ext}`;
    await FileSystem.writeAsStringAsync(path, base64, { encoding: "base64" });
    formData.append("firma", {
      uri: path,
      type: mime,
      name: `firma.${ext}`,
    } as any);
};

export default appendFirmaDataUrlToFormData;