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
  const MIN_TABBAR_HEIGHT_IOS = 50; // Ajustado a 50dp que es más estándar para iOS sin safe area

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
          tabBarActiveTintColor: "#059669", // Tu color activo actual
          tabBarInactiveTintColor: "#64748b", // Tu color inactivo actual
          tabBarStyle: {
            height: tabBarHeight, // <-- ¡Aquí es donde se aplica la altura calculada!
            paddingBottom: bottomInset, // <-- ¡Y aquí se asegura que el contenido de la barra se desplace por el safe area!
            paddingTop: 8, // Pequeño padding superior para los iconos
            backgroundColor: "#fff",
            elevation: 8, // Sombra para Android (Material Design)
            // Sombras para iOS (similar a Material Design en apariencia)
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            borderTopWidth: 1, // Línea separadora superior
            borderTopColor: "#ccc", // Color de la línea
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 2,
            marginBottom: 4,
          },
          tabBarIconStyle: {
            marginBottom: -4, // Esto podría necesitar ajuste si el espacio no es el deseado
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
