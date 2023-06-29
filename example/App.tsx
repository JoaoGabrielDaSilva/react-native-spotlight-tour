import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { SpotlightProvider } from "react-native-spotlight-tour-guide";
import { StackRoutes } from "./src/routes/stack.routes";

export default function App() {
  return (
    <SpotlightProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    </SpotlightProvider>
  );
}
