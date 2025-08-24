import { useState } from "react";
import { Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Constants from "expo-constants";

// Obtener host local
const getLocalHost = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (!debuggerHost) return "http://localhost:3001";
  const ip = debuggerHost.split(":")[0];
  return `http://${ip}:3001`;
};

// Detectar MIME type por extensión
const getMimeType = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "xls":
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "txt":
      return "text/plain";
    case "csv":
      return "text/csv";
    default:
      return "application/octet-stream";
  }
};

// Generar nombre único si ya existe
const generateUniqueFilename = (
  original: string,
  existingNames: Set<string>
) => {
  let name = original;
  let counter = 1;
  const dotIndex = original.lastIndexOf(".");
  const base = dotIndex !== -1 ? original.slice(0, dotIndex) : original;
  const ext = dotIndex !== -1 ? original.slice(dotIndex) : "";

  while (existingNames.has(name)) {
    name = `${base}(${counter})${ext}`;
    counter++;
  }
  return name;
};

export const useDownloadFile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const download = async (
    id: string,
    filename: string,
    headers?: Record<string, string>
  ) => {
    setIsLoading(true);
    try {
      const safeFilename = filename.replace(/[^a-z0-9.\-_]/gi, "_");
      const fileUrl = `${getLocalHost()}/file/${id}`;

      // Descargar archivo a cache temporal
      const localUri = FileSystem.cacheDirectory + safeFilename;
      const result = await FileSystem.downloadAsync(fileUrl, localUri, {
        headers,
      });

      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          Alert.alert(
            "Permiso denegado",
            "No se puede guardar el archivo sin permisos"
          );
          return;
        }

        // Leer archivos existentes en la carpeta elegida
        const existingNames = new Set(
          await FileSystem.StorageAccessFramework.readDirectoryAsync(
            permissions.directoryUri
          )
        );
        const uniqueFilename = generateUniqueFilename(
          safeFilename,
          existingNames
        );

        const uri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          uniqueFilename,
          getMimeType(uniqueFilename)
        );

        const base64 = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.writeAsStringAsync(uri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Alert.alert(
          "Archivo guardado",
          `Archivo guardado correctamente como ${uniqueFilename}`
        );
      } else {
        // iOS: fallback
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result.uri, {
            mimeType: getMimeType(safeFilename),
          });
        } else {
          Alert.alert(
            "Archivo descargado",
            `Archivo disponible en: ${result.uri}`
          );
        }
      }
    } catch (e) {
      console.error("Error al descargar el archivo:", e);
      Alert.alert("Error", "No se pudo descargar el archivo");
    } finally {
      setIsLoading(false);
    }
  };

  return { download, isLoading };
};
