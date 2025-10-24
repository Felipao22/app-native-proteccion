import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { X } from "lucide-react-native";
import type { Kind } from "@/services/filesApi";
import { DatePickerField } from "../components/DatePickerField";
import type { Users } from "@/services/usuariosApi";

interface Filters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  kindId?: string;
}

interface FilterModalProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  categories?: Kind[];
  users?: Users[];
  startDate?: string;
  endDate?: string;
  userId?: string;
  kindId?: string;
  onApplyFilters: (filters: Filters) => void;
  clearFilters?: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  showFilters,
  setShowFilters,
  categories = [],
  users = [],
  startDate,
  endDate,
  userId,
  kindId,
  onApplyFilters,
  clearFilters,
}) => {
  const [tempFilters, setTempFilters] = useState<Filters>({
    startDate: startDate ?? "",
    endDate: endDate ?? "",
    userId: userId ?? "",
    kindId: kindId ?? "",
  });

  useEffect(() => {
    if (showFilters) {
      setTempFilters({
        startDate: startDate ?? "",
        endDate: endDate ?? "",
        userId: userId ?? "",
        kindId: kindId ?? "",
      });
    }
  }, [startDate, endDate, userId, kindId]);

  const applyFilters = () => {
    onApplyFilters(tempFilters);
    setShowFilters(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showFilters}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar Documentos</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilters(false)}
            >
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Rango de fechas */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Rango de fechas</Text>
              <View style={styles.dateInputsContainer}>
                <View style={styles.dateInputWrapper}>
                  <Text style={styles.dateInputLabel}>Desde:</Text>
                  <DatePickerField
                    value={tempFilters.startDate}
                    onChange={(text) =>
                      setTempFilters((prev) => ({ ...prev, startDate: text }))
                    }
                    maxDate={
                      tempFilters.endDate
                        ? new Date(
                            tempFilters.endDate.split("/").reverse().join("-")
                          )
                        : undefined
                    }
                    allowClear={true}
                  />
                </View>

                <View style={styles.dateInputWrapper}>
                  <Text style={styles.dateInputLabel}>Hasta:</Text>
                  <DatePickerField
                    value={tempFilters.endDate}
                    onChange={(text) =>
                      setTempFilters((prev) => ({ ...prev, endDate: text }))
                    }
                    minDate={
                      tempFilters.startDate
                        ? new Date(
                            tempFilters.startDate.split("/").reverse().join("-")
                          )
                        : undefined
                    }
                    allowClear={true}
                  />
                </View>
              </View>
            </View>

            {/* Categorías */}
            {categories && categories.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Categoría</Text>
                <View style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryFilterButton,
                        tempFilters.kindId === cat.id &&
                          styles.categoryFilterButtonActive,
                      ]}
                      onPress={() =>
                        setTempFilters((prev) => ({
                          ...prev,
                          kindId: prev.kindId === cat.id ? "" : cat.id,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.categoryFilterText,
                          tempFilters.kindId === cat.id &&
                            styles.categoryFilterTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Empresas */}
            {users && users.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Empresa</Text>
                <View style={styles.categoryGrid}>
                  {users.map((u) => (
                    <TouchableOpacity
                      key={u.userId}
                      style={[
                        styles.categoryFilterButton,
                        tempFilters.userId === u.userId &&
                          styles.categoryFilterButtonActive,
                      ]}
                      onPress={() =>
                        setTempFilters((prev) => ({
                          ...prev,
                          userId: prev.userId === u.userId ? "" : u.userId,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.categoryFilterText,
                          tempFilters.userId === u.userId &&
                            styles.categoryFilterTextActive,
                        ]}
                      >
                        {u.nombreEmpresa}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Limpiar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  closeButton: {
    padding: 4,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
  },
  dateInputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
  },
  categoryFilterButtonActive: {
    backgroundColor: "#1e40af",
    borderColor: "#1e40af",
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  categoryFilterTextActive: {
    color: "#ffffff",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#1e40af",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dateInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateInputWrapper: {
    flex: 1,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  categoryFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    margin: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginTop: 6,
  },
});
