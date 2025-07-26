import { Tabs } from "expo-router";
import {
  House,
  ClipboardCheck,
  TriangleAlert as AlertTriangle,
  GraduationCap,
  User,
} from "lucide-react-native";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#059669",
        tabBarInactiveTintColor: "#64748b",
        headerShadowVisible: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom:
            Platform.OS === "android" ? insets.bottom : insets.bottom + 10,
          paddingTop: 10,
          borderTopWidth: 0.5,
          borderTopColor: "#ccc",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <House size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ConstanciaVisitaScreen"
        options={{
          title: "Constancia Visita",
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <House size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
