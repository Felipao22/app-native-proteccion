import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { HapticTab } from "@/components/haptic-tab";
import { File, House } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
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
  );
}
