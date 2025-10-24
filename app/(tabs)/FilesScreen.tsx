import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
  Keyboard,
  RefreshControl,
} from "react-native";
import {
  Search,
  Download,
  FileText,
  Image,
  Video,
  File,
  Calendar,
  FolderOpen,
  Trash,
  Filter,
} from "lucide-react-native";
import {
  useGetFilesQuery,
  useGetKindsFilesQuery,
  usePostDeleteFileByIdMutation,
  usePostFilterFilesMutation,
} from "../../services/filesApi";
import { formatDateWithHours } from "../../utils/parseDate";
import { useDownloadFile } from "../../hooks/useDownloadFile";
import {
  useGetUsersQuery,
  type File as typeFile,
} from "@/services/usuariosApi";
import { useRefresh } from "../../hooks/useOnRefresh";
import { filtersApplied } from "../../services/filesApi";
import FilterModal from "../../components/FilterModal";

export default function FilesScreen() {
  const initialValues = {
    startDate: "",
    endDate: "",
    userId: "",
    kindId: "",
  };
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [filteredFiles, setFilteredFiles] = useState<typeFile[]>([]);
  const [filters, setFilters] = useState<filtersApplied>(initialValues);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  //Querys Redux
  const {
    data: filesData,
    isFetching,
    refetch,
  } = useGetFilesQuery(searchQuery || undefined);
  const { data: kindsData, isFetching: isFetchingKinds } =
    useGetKindsFilesQuery();
  const { data: userData, isFetching: isFetchingUsers } = useGetUsersQuery();

  //Mutation Redux
  const [deleteFileById, { isLoading: isDeleting }] =
    usePostDeleteFileByIdMutation();
  const [filterFiles, { isLoading: isFiltering }] =
    usePostFilterFilesMutation();

  //Custom hook
  const { download, isLoading } = useDownloadFile();
  const { refreshing, onRefresh } = useRefresh(async () => {
    await refetch();
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "application/pdf":
        return <FileText size={24} color="#dc2626" />;
      case "excel":
        return <FileText size={24} color="#059669" />;
      case "word":
        return <FileText size={24} color="#1e40af" />;
      case "video":
        return <Video size={24} color="#7c3aed" />;
      case "image":
        return <Image size={24} color="#ea580c" />;
      case "zip":
        return <FolderOpen size={24} color="#64748b" />;
      default:
        return <File size={24} color="#64748b" />;
    }
  };

  const categoryColorMap: Record<string, string> = {
    Botiquines: "#1e40af",
    "Constancia de visita": "#059669",
    "Reportes de incidencia": "#dc2626",
    Capacitación: "#7c3aed",
    "Plan Anual de Capacitaciones": "#7c3aed",
    "Control de Infraestructura": "#7c3aed",
    "Control de Escaleras": "#7c3aed",
    "Control de Máquinas y Herramientas": "#7c3aed",
    "Control de Uso de EPP": "#7c3aed",
    "Control de Vehículos": "#7c3aed",
    "Luces de emergencia": "#7c3aed",
    "Tableros eléctricos": "#7c3aed",
    "Avisos de Inicio de Obra": "#0891b2",
    "Plan Ante Emergencias": "#ea580c",
    "Carga de Fuego": "#0891b2",
    Carteleria: "#0891b2",
    Matafuegos: "#0891b2",
    Iluminación: "#0891b2",
    Ruido: "#0891b2",
    Ergonomía: "#0891b2",
    "R.A.R.": "#0891b2",
    "R.G.R.L.": "#0891b2",
    "Puesta a tierra": "#0891b2",
    "Evaluación de Riesgos": "#0891b2",
    "Procedimientos de Trabajo": "#0891b2",
    "Programa de Seguridad de Obra": "#0891b2",
    "Informe para Habilitación Municipal": "#0891b2",
    "Cronograma del servicio": "#0891b2",
    "Control de Legajo Técnico": "#0891b2",
    Otros: "#64748b",
    "Medicina Laboral": "#64748b",
    "Medio Ambiente": "#64748b",
    "Recursos Humanos": "#64748b",
  };

  const getCategory = (kindId: string | number) => {
    if (!kindsData || !Array.isArray(kindsData)) return "Unknown";

    const kind = kindsData.find((kind) => String(kind.id) === String(kindId));
    return kind ? kind.name : "Unknown";
  };

  const getCategoryColorByKindId = (kindId: string | number) => {
    if (!kindsData || !Array.isArray(kindsData)) return "#64748b";

    const kind = kindsData.find((k) => String(k.id) === String(kindId));
    if (!kind) return "#64748b";

    const color = categoryColorMap[kind.name];
    return color || "#64748b";
  };

  const getFilesFiltered = async (appliedFilters: filtersApplied) => {
    try {
      const response = await filterFiles(appliedFilters).unwrap();
      if (response?.data && Array.isArray(response.data)) {
        setFilteredFiles(response.data);
        setIsSearched(true);
      } else {
        setFilteredFiles([]);
        setIsSearched(false);
      }

      setFilters(appliedFilters);
    } catch (error) {
      console.error("Error al obtener archivos filtrados:", error);
      Alert.alert("Error", "No se pudieron cargar los archivos filtrados");
    }
  };

  if (isFetching || isFetchingKinds || isFiltering || isFetchingUsers) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#1e40af" />
          <Text style={styles.loadingText}>Cargando archivos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sanitizeInput = (text: string) => {
    return text
      .normalize("NFD") // separa acentos (á -> a +  ́)
      .replace(/[\u0300-\u036f]/g, "") // quita acentos
      .replace(/[^a-zA-Z0-9\s]/g, "") // solo letras, números y espacios
      .trim();
  };

  const handleDeleteFileById = async (id: string) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este archivo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Si, Eliminar",
          onPress: async () => {
            try {
              const response = await deleteFileById(id).unwrap();
              if (response) {
                Alert.alert("Archivo eliminado con éxito");
              }
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el archivo");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleClearFilters = async () => {
    await refetch();
    setIsSearched(false);
    setFilteredFiles([]);
    setSearchInput("");
    setSearchQuery("");
    setFilters(initialValues);
    setShowFilters(false);
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    const formatedQuery = sanitizeInput(searchInput);
    setSearchQuery(formatedQuery);
  };

  const dataToRender = isSearched ? filteredFiles : filesData;

  const getActiveFiltersCount = () => {
    let count = 0;

    if (filters?.userId && filters.userId.trim() !== "") count++;
    if (
      (filters?.startDate && filters.startDate.trim() !== "") ||
      (filters?.endDate && filters.endDate.trim() !== "")
    )
      count++;
    if (filters?.kindId && filters.kindId !== "") count++;

    return count;
  };

  const openFilters = () => {
    setShowFilters(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isFetching}
            onRefresh={onRefresh}
            colors={["#1e40af"]}
            tintColor="#1e40af"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Archivos cargados</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>{filesData?.length} archivos</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar archivos..."
              placeholderTextColor="#94a3b8"
              value={searchInput}
              onChangeText={setSearchInput}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch}>
              <Search
                size={20}
                color="#64748b"
                style={styles.searchIcon}
                onPress={handleSearch}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                getActiveFiltersCount() > 0 && styles.filterButtonActive,
              ]}
              onPress={openFilters}
            >
              <Filter
                size={20}
                color={getActiveFiltersCount() > 0 ? "#ffffff" : "#64748b"}
              />
              {getActiveFiltersCount() > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>
                    {getActiveFiltersCount()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {dataToRender && dataToRender.length > 0 ? (
            dataToRender.map((document) => (
              <View key={document.id} style={styles.documentCard}>
                <View key={document.id} style={styles.documentCard}>
                  <View style={styles.documentHeader}>
                    <View style={styles.documentInfo}>
                      <View style={styles.fileIconContainer}>
                        {getFileIcon(document.type)}
                      </View>
                      <View style={styles.documentDetails}>
                        <Text style={styles.documentName} numberOfLines={2}>
                          {document.name}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.categoryBadge,
                        {
                          backgroundColor: getCategoryColorByKindId(
                            document.kindId
                          ),
                        },
                      ]}
                    >
                      <Text style={styles.categoryBadgeText}>
                        {getCategory(document.kindId)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.documentMeta}>
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Tamaño: </Text>
                        <Text style={styles.metaValue}>
                          {document.size} Kb.
                        </Text>
                      </View>
                    </View>
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Calendar size={14} color="#64748b" />
                        <Text style={styles.metaText}>
                          {formatDateWithHours(document.createdAt, "es")}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.documentActions}>
                    <TouchableOpacity
                      style={[styles.actionButtonDelete]}
                      onPress={() => handleDeleteFileById(document.id)}
                    >
                      {isDeleting ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Trash size={18} color="#ffffff" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.downloadButton]}
                      onPress={() => download(document.id, document.name)}
                    >
                      <Download size={18} color="#ffffff" />
                      <Text
                        style={[
                          styles.actionButtonText,
                          styles.downloadButtonText,
                        ]}
                      >
                        {isLoading ? "Descargando" : "Descargar"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noResultsText}>
              No se encontraron documentos
            </Text>
          )}
        </ScrollView>
      </ScrollView>
      <FilterModal
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        categories={Array.isArray(kindsData) ? kindsData : []}
        startDate={filters?.startDate}
        endDate={filters?.endDate}
        onApplyFilters={getFilesFiltered}
        clearFilters={handleClearFilters}
        kindId={filters?.kindId}
        users={Array.isArray(userData) ? userData : []}
        userId={filters?.userId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  statsContainer: {
    backgroundColor: "#1e40af",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#1e293b",
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryButtonActive: {
    backgroundColor: "#1e40af",
    borderColor: "#1e40af",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  documentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  documentInfo: {
    flexDirection: "row",
    flex: 1,
    marginRight: 12,
  },
  fileIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
  documentMeta: {
    marginBottom: 16,
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e293b",
  },
  metaText: {
    fontSize: 12,
    color: "#64748b",
  },
  documentActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 8,
  },
  downloadButton: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e40af",
  },
  downloadButtonText: {
    color: "#ffffff",
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
  },
  clearFiltersContainer: {
    paddingHorizontal: 24,
    marginBottom: 12,
    alignItems: "flex-end",
  },
  clearFiltersButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearFiltersText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#64748b",
    marginTop: 20,
    fontStyle: "italic",
  },
  actionButtonDelete: {
    backgroundColor: "#fc0303",
    borderColor: "#fc0303",
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
  filterButton: {
    position: "relative",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterButtonActive: {
    backgroundColor: "#1e40af",
    borderColor: "#1e40af",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 8,
  },
});
