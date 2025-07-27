import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  House,
  ClipboardCheck,
  TriangleAlert as AlertTriangle,
  GraduationCap,
  User,
  File,
} from "lucide-react-native";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const MIN_TABBAR_HEIGHT_ANDROID = 56;
  const MIN_TABBAR_HEIGHT_IOS = 50;

  const bottomInset = insets.bottom || 0;

  // Calculamos la altura total de la tabBar sumando la altura mínima y el safe area inferior.
  const tabBarHeight =
    Platform.OS === "android"
      ? MIN_TABBAR_HEIGHT_ANDROID + bottomInset
      : MIN_TABBAR_HEIGHT_IOS + bottomInset;

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#059669",
          tabBarInactiveTintColor: "#64748b",
          tabBarStyle: {
            height: tabBarHeight,
            paddingBottom: bottomInset,
            paddingTop: 8,
            backgroundColor: "#fff",
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            borderTopWidth: 1,
            borderTopColor: "#ccc",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 2,
            marginBottom: 4,
          },
          tabBarIconStyle: {
            marginBottom: -4,
          },
          tabBarShowLabel: true,
          tabBarAllowFontScaling: false,
          tabBarHideOnKeyboard: true,
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
          name="FilesScreen"
          options={{
            title: "Archivos",
            tabBarIcon: ({ size, color }: { size: number; color: string }) => (
              <File size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ConstanciaVisitaScreen"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
