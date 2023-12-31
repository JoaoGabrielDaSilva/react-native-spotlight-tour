import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useRef } from "react";
import Animated from "react-native-reanimated";
import { Post } from "../components/post";
import {
  SpotlightScrollView,
  Step,
  useSpotlight,
} from "react-native-spotlight-tour-guide";

export const Feed = () => {
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
            {
              name: "show-post-image",
              text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid deleniti harum similique beatae ex aperiam earum delectus nulla pariatur tenetur! Delectus, ducimus et veniam autem repellendus fuga sunt accusantium cupiditate?",
            },
            {
              name: "show-post-like-button",
              text: "here you can like the post",
            },
            {
              name: "show-post-comment-button",
              text: "and here you can comment on a post",
            },
          ];

          start("feed-post-tour", steps);
        }}
      >
        <Text style={[styles.startButton]}>Start Tutorial</Text>
      </TouchableOpacity>

      <Post tourEnabled={false} />

      <Step
        tourKeys={["feed-post-tour"]}
        name="show-post"
        verticalScrollView={scrollViewRef}
        style={{ marginTop: 24 }}
      >
        <Post />
      </Step>
    </SpotlightScrollView>
  );
};

const styles = StyleSheet.create({
  startButton: {
    alignSelf: "center",
    marginVertical: 24,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
});
