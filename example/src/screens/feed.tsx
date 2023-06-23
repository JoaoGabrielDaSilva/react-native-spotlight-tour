import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRef } from "react";
import Animated from "react-native-reanimated";
import { Post } from "../components/post";
import {
  SpotlightFlatList,
  SpotlightScrollView,
  Step,
  useSpotlight,
} from "react-native-spotlight-tour-guide";

const userImages = [
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR69jZp2GHRMRDekzK6-0T3xs5b6Rcvnp7NVA&usqp=CAU",
  "https://hips.hearstapps.com/hmg-prod/images/screen-shot-2018-07-11-at-5-10-02-pm-1531412351.png?crop=1.00xw:0.667xh;0,0.199xh&resize=1200:*",
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR69jZp2GHRMRDekzK6-0T3xs5b6Rcvnp7NVA&usqp=CAU",
  "https://hips.hearstapps.com/hmg-prod/images/screen-shot-2018-07-11-at-5-10-02-pm-1531412351.png?crop=1.00xw:0.667xh;0,0.199xh&resize=1200:*",
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR69jZp2GHRMRDekzK6-0T3xs5b6Rcvnp7NVA&usqp=CAU",
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR69jZp2GHRMRDekzK6-0T3xs5b6Rcvnp7NVA&usqp=CAU",
  "https://hips.hearstapps.com/hmg-prod/images/screen-shot-2018-07-11-at-5-10-02-pm-1531412351.png?crop=1.00xw:0.667xh;0,0.199xh&resize=1200:*",
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR69jZp2GHRMRDekzK6-0T3xs5b6Rcvnp7NVA&usqp=CAU",
  "https://hips.hearstapps.com/hmg-prod/images/screen-shot-2018-07-11-at-5-10-02-pm-1531412351.png?crop=1.00xw:0.667xh;0,0.199xh&resize=1200:*",
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR69jZp2GHRMRDekzK6-0T3xs5b6Rcvnp7NVA&usqp=CAU",
];

export const Feed = () => {
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const firstHorizontalFlatlistRef = useRef<Animated.FlatList<any>>(null);
  const horizontalFlatlistRef = useRef<Animated.FlatList<any>>(null);

  const { start } = useSpotlight();

  return (
    <SpotlightScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ padding: 16 }}
    >
      <TouchableOpacity
        onPress={() => {
          const steps = [
            {
              name: `show-story-${userImages.length - 1}`,
              text: `This is the step number ${userImages.length + 1}`,
            },
            { name: "show-story-0", text: "This is the step number 1" },
            {
              name: `show-story-${userImages.length - 1}`,
              text: `This is the step number  ${userImages.length + 1}`,
            },
            { name: "show-story-0", text: "This is the step number 1" },
          ];

          start("tour-one", steps);
        }}
      >
        <Text style={styles.startButton}>Start Tutorial 1</Text>
      </TouchableOpacity>

      <SpotlightFlatList
        ref={firstHorizontalFlatlistRef}
        data={userImages}
        disableVirtualization
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => String(index)}
        horizontal
        renderItem={({ item, index }) => (
          <Step
            tourKeys={["tour-one", "tour-three"]}
            name={`show-story-${index}`}
            flatList={firstHorizontalFlatlistRef}
            scrollView={scrollViewRef}
            style={{ marginTop: 24, marginRight: 12 }}
          >
            <View>
              <Image source={{ uri: item }} style={styles.storyImage} />
            </View>
          </Step>
        )}
      />

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
          ];

          start("tour-two", steps);
        }}
      >
        <Text style={[styles.startButton, { marginTop: 24 }]}>
          Start Tutorial 2
        </Text>
      </TouchableOpacity>
      <Step
        tourKeys={["tour-two"]}
        name="show-post"
        scrollView={scrollViewRef}
        style={{ marginTop: 24 }}
      >
        <Post />
      </Step>

      <TouchableOpacity
        onPress={() => {
          const steps = [
            {
              name: `show-story-${userImages.length - 1}`,
              text: `This is the step number  ${userImages.length + 1}`,
            },
            {
              name: `show-second-story-${userImages.length - 1}`,
              text: `This is the step number  ${userImages.length + 1}`,
            },
            { name: "show-story-0", text: "This is the step number 1" },

            { name: "show-second-story-0", text: "This is the step number 1" },
          ];

          start("tour-three", steps);
        }}
      >
        <Text
          style={[styles.startButton, { marginBottom: 200, marginTop: 100 }]}
        >
          Start Tutorial 3
        </Text>
      </TouchableOpacity>

      <SpotlightFlatList
        ref={horizontalFlatlistRef}
        data={userImages}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => String(index)}
        horizontal
        renderItem={({ item, index }) => (
          <Step
            tourKeys={["tour-three"]}
            name={`show-second-story-${index}`}
            scrollView={scrollViewRef}
            flatList={horizontalFlatlistRef}
            style={{ marginTop: 24, marginRight: 12 }}
          >
            <View>
              <Image source={{ uri: item }} style={styles.storyImage} />
            </View>
          </Step>
        )}
      />
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
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
});
