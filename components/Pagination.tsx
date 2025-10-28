import React from "react";
import {
  ChevronRight,
  ChevronLeft,
  ChevronLast,
  ChevronFirst,
} from "lucide-react-native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PaginationProps {
  resetPagination: () => void;
  hasPrevPage: boolean;
  prevPage: () => void;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: () => void;
  lastPage: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  resetPagination,
  hasPrevPage,
  prevPage,
  page,
  totalPages,
  hasNextPage,
  nextPage,
  lastPage,
}) => {
  return (
    <>
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={resetPagination}
          disabled={!hasPrevPage}
          style={[styles.pageButton, !hasPrevPage && styles.disabledButton]}
        >
          <ChevronFirst color="#fff" size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={prevPage}
          disabled={!hasPrevPage}
          style={[styles.pageButton, !hasPrevPage && styles.disabledButton]}
        >
          <ChevronLeft color="#fff" size={16} />
        </TouchableOpacity>

        <Text style={styles.pageInfo}>
          Página {page} de {totalPages}
        </Text>

        <TouchableOpacity
          onPress={nextPage}
          disabled={!hasNextPage}
          style={[styles.pageButton, !hasNextPage && styles.disabledButton]}
        >
          <ChevronRight color="#fff" size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={lastPage}
          disabled={!hasNextPage}
          style={[styles.pageButton, !hasNextPage && styles.disabledButton]}
        >
          <ChevronLast color="#fff" size={16} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  pageButton: {
    backgroundColor: "#1e40af",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  disabledButton: {
    backgroundColor: "#94a3b8",
  },
  pageButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  pageInfo: {
    fontSize: 16,
    color: "#1e293b",
  },
});
