import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { Tabs } from "./src/routes/tabs.routes";
import { SpotlightProvider } from "react-native-spotlight-tour-guide";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <SpotlightProvider>
        <NavigationContainer>
          <Tabs />
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
