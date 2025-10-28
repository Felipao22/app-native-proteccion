import { useState, useCallback, useMemo } from "react";
import type { pagination } from "../services/filesApi.ts";

export function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const updatePagination = useCallback((paginationData: pagination) => {
    if (!paginationData) return;
    const { page, totalPages, total } = paginationData;
    setPage(page);
    setTotalPages(totalPages);
    setTotalItems(total);
  }, []);

  //Funciones de navegación
  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);

  const goToPage = useCallback(
    (targetPage: pagination["page"]) => {
      const pageNum = Math.max(1, Math.min(targetPage, totalPages));
      setPage(pageNum);
    },
    [totalPages]
  );

  const resetPagination = useCallback(() => {
    setPage(initialPage);
  }, [initialPage, initialLimit]);

  const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);
  const hasPrevPage = useMemo(() => page > 1, [page]);

  return {
    page,
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
    updatePagination,
    lastPage,
  };
}
