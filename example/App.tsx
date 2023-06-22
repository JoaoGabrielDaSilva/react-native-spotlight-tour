import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { SpotlightProvider } from "react-native-spotlight-tour";
import { Tabs } from "./src/routes/tabs.routes";

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
