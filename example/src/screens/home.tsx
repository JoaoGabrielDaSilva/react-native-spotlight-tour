import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useRef } from "react";
import Animated from "react-native-reanimated";
import { Post } from "../components/post";
import {
  SpotlightScrollView,
  Step,
  useSpotlight,
} from "react-native-spotlight-tour-guide";

export const Home = () => {
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const { start } = useSpotlight();

  return (
    <SpotlightScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ padding: 16 }}
    >
      <TouchableOpacity
        onPress={() => {
          const steps = [
            { name: "show-post", text: "This is a post" },
            {
              name: "show-post-owner",
              text: "This is the data of the owner of the post",
            },
            { name: "show-post-image", text: "This is the post image" },
            {
              name: "show-post-action-bar",
              text: "this is the post's action bar",
            },
            { name: "show-post-image", text: "this is the post's image again" },
            {
              name: "show-post-like-button",
              text: "here you can like the post",
            },
            {
              name: "show-post-comment-button",
              text: "and here you can comment on a post",
            },
            {
              name: "show-profile-tab",
              text: "If you want to go to the profile screen, just click here",
            },
            {
              name: "show-user-profile-picture",
              text: "And this is your profile Picture",
            },
            {
              name: "show-the-end-of-the-tour",
              text: "And this is the last step :)",
            },
          ];

          start("tour-one", steps);
        }}
      >
        <Text style={styles.startButton}>Start Tutorial 1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          const steps = [
            {
              name: "show-profile-tab",
              text: "If you want to go to the profile screen, just click here",
            },
            {
              name: "show-user-profile-picture",
              text: "And this is your profile Picture",
            },
            {
              name: "show-the-end-of-the-tour",
              text: "And this is the last step :)",
            },
          ];

          start("tour-two", steps);
        }}
      >
        <Text style={styles.startButton}>Start Tutorial 2</Text>
      </TouchableOpacity>

      <Step
        tourKeys={["tour-one"]}
        name="show-post"
        scrollView={scrollViewRef}
        style={{ marginTop: 100 }}
      >
        <Post />
      </Step>
    </SpotlightScrollView>
  );
};

const styles = StyleSheet.create({
  tourOneText: {
    backgroundColor: "#35c73c",
  },
  startButton: {
    alignSelf: "center",
  },
});
