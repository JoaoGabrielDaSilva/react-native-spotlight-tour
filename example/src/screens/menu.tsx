import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSpotlight } from "react-native-spotlight-tour-guide";

const { width } = Dimensions.get("window");

export const Menu = () => {
  const { start } = useSpotlight();

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          const steps = [
            { name: "show-stories-tab", text: "This is the stories tab" },
            { name: "show-feed-tab", text: "This is the feed tab" },
            { name: "show-profile-tab", text: "This is the profile tab" },
            { name: "show-menu-tab", text: "This is the menu tab" },
          ];

          start("menu-tour", steps);
        }}
      >
        <Text style={styles.startButton}>Start Tabs Tutorial</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  startButton: {
    alignSelf: "center",
    marginTop: 32,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  suggestion: {
    width: width * 0.35,
    height: width * 0.5,
    borderRadius: 12,
  },
});
