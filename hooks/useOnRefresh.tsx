import { useCallback, useState } from "react";

/**
 * Custom hook para manejar pull-to-refresh en React Native.
 * @param refreshFunction Función asíncrona que se ejecuta al refrescar los datos.
 * @returns { refreshing, onRefresh } Estado y función para RefreshControl.
 */
export const useRefresh = (refreshFunction: () => Promise<void>) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refreshFunction();
    } catch (error) {
      console.error("Error al refrescar:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshFunction]);

  return { refreshing, onRefresh };
};
