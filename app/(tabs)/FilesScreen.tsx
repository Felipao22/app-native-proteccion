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
  Eye,
} from "lucide-react-native";
import {
  useGetFilesQuery,
  useGetKindsFilesQuery,
} from "../../services/filesApi";
import { formatDate } from "../../utils/parseDate";
import { useDownloadFile } from "../../hooks/useDownloadFile";

export default function FilesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  //Querys Redux
  const { data: filesData, isFetching } = useGetFilesQuery();
  const { data: kindsData, isFetching: isFetchingKinds } =
    useGetKindsFilesQuery();

  //Custom hook
  const { download, isLoading } = useDownloadFile();

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

  // const handlePreview = (document: any) => {
  //   Alert.alert("Preview File", `Open "${document.name}" for preview?`, [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Open",
  //       onPress: () => {
  //         // In a real app, this would open the file preview
  //         Alert.alert("Preview", `Opening ${document.name} for preview...`);
  //       },
  //     },
  //   ]);
  // };

  if (isFetching || isFetchingKinds) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#1e40af" />
          <Text style={styles.loadingText}>Cargando archivos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Archivos cargados</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>{filesData?.length} archivos</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar archivos..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {Array.isArray(kindsData) &&
          kindsData.map((category: any) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {filesData &&
          filesData.map((document) => (
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
                    {/* <Text style={styles.documentDescription} numberOfLines={2}>
                    {document.description}
                  </Text> */}
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
                    <Text style={styles.metaValue}>{document.size} Kb.</Text>
                  </View>
                  {/* <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Downloads: </Text>
                  <Text style={styles.metaValue}>{document.downloads}</Text>
                </View> */}
                </View>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Calendar size={14} color="#64748b" />
                    <Text style={styles.metaText}>
                      {formatDate(document.createdAt, "es")}
                    </Text>
                  </View>
                  {/* <View style={styles.metaItem}>
                  <User size={14} color="#64748b" />
                  <Text style={styles.metaText}>{document.uploadedBy}</Text>
                </View> */}
                </View>
              </View>

              <View style={styles.documentActions}>
                {/* <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handlePreview(document)}
                >
                  <Eye size={18} color="#1e40af" />
                  <Text style={styles.actionButtonText}>Previsualizar</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={[styles.actionButton, styles.downloadButton]}
                  onPress={() => download(document.id, document.name)}
                >
                  <Download size={18} color="#ffffff" />
                  <Text
                    style={[styles.actionButtonText, styles.downloadButtonText]}
                  >
                    {isLoading ? "Descargando" : "Descargar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
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
});
