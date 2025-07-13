import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePostLogOutMutation } from "../../services/loginApi";
import {
  Shield,
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Plus,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [showAllActios, setShowAllActios] = useState(false);

  const router = useRouter();

  const insets = useSafeAreaInsets();

  //Mutation Redux
  const [posLogOut] = usePostLogOutMutation();

  // Al montar el componente, leer datos del storage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        }
      } catch (error) {
        console.error("Error al leer los datos del usuario", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await posLogOut().unwrap();
      await AsyncStorage.clear();
      router.replace("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Cargando datos del usuario...</Text>
      </View>
    );
  }

  const quickActions = [
    {
      title: "Constancia de visita",
      icon: CheckCircle,
      color: "#059669",
      screen: "ConstanciaVisitaScreen",
    },
    {
      title: "Informe de incidentes-accidentes",
      icon: AlertTriangle,
      color: "#dc2626",
    },
    { title: "Control de botiquines", icon: Shield, color: "#1e40af" },
    { title: "Control de extintores", icon: Users, color: "#7c3aed" },
    { title: "Control de escaleras", icon: Users, color: "#7c3aed" },
    { title: "Control de luces de emergencia", icon: Users, color: "#7c3aed" },
    {
      title: "Control de maquinas y herramientas eléctricas",
      icon: Users,
      color: "#7c3aed",
    },
    { title: "Control de neumáticos", icon: Users, color: "#7c3aed" },
    { title: "Control de tableros electricos", icon: Users, color: "#7c3aed" },
    { title: "Control de uso de E.P.P.", icon: Users, color: "#7c3aed" },
    { title: "Control de vehículos", icon: Users, color: "#7c3aed" },
    { title: "Informe de infraestructura", icon: Users, color: "#7c3aed" },
    {
      title: "Relevamiento de documentación Técnico Legal",
      icon: Users,
      color: "#7c3aed",
    },
    { title: "Reporte de incidencia", icon: Users, color: "#7c3aed" },
  ];

  const actionsVisibles = showAllActios
    ? quickActions
    : quickActions.slice(0, 6);

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Bienvenido/a,</Text>
              <Text
                style={styles.nameText}
              >{`${userData.name} ${userData.lastName}`}</Text>
            </View>
            {/* <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#64748b" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity> */}
          </View>

          {/* <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Safety Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <stat.icon size={24} color={stat.color} />
                  <Text style={[styles.statChange, { color: stat.color }]}>
                    {stat.change}
                  </Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>
        </View> */}

          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Acciones</Text>
            <View style={styles.actionsGrid}>
              {actionsVisibles.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionCard}
                  onPress={() => router.replace(action.screen)}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: action.color },
                    ]}
                  >
                    <action.icon size={24} color="#ffffff" />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {quickActions.length > 6 && (
            <TouchableOpacity
              onPress={() => setShowAllActios(!showAllActios)}
              style={styles.toggleButton}
            >
              <View style={styles.toggleContent}>
                <Text style={styles.toggleButtonText}>
                  {showAllActios ? "Ver menos" : "Ver más"}
                </Text>
                {showAllActios ? (
                  <ChevronUp size={18} color="#1e40af" />
                ) : (
                  <ChevronDown size={18} color="#1e40af" />
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* <View style={styles.recentContainer}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentActivities.map((activity, index) => (
            <View key={index} style={styles.activityCard}>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      activity.status === "completed" ? "#059669" : "#ea580c",
                  },
                ]}
              />
            </View>
          ))}
        </View> */}
          <TouchableOpacity onPress={handleLogout} style={{ marginTop: 16 }}>
            <Text
              style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
            >
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingTop: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: "#64748b",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 4,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#dc2626",
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statChange: {
    fontSize: 12,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: "#64748b",
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "center",
  },
  recentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "600",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: "#64748b",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  toggleButton: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  toggleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  toggleButtonText: {
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "600",
    marginLeft: 6,
  },
});
