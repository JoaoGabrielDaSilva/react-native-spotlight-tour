import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { SpotlightProvider } from "react-native-spotlight-tour-guide";
import { StackRoutes } from "./src/routes/stack.routes";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <SpotlightProvider>
        <NavigationContainer>
          <StackRoutes />
        </NavigationContainer>
      </SpotlightProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
