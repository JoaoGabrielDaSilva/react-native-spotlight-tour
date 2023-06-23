import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRef } from "react";
import Animated from "react-native-reanimated";
import {
  SpotlightFlatList,
  SpotlightScrollView,
  Step,
  useSpotlight,
} from "react-native-spotlight-tour-guide";

const storiesImages = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSAVKC8ZgF8DoDOdbDolbEr1bGqGVK__u894HnEK1dWcbfH2qMveCoi8PGal7IIEZATc&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8IeEG05S9R230-k2j2FXs8jF303vPMpcbmEEMmq4TKeWL8fuqDn29xrf-FrMmHsMYGLw&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcit7U-g7YY3AZUXCIosu6o9G-Trvv4EEfCrV43ASnGwhyYOFaEPm5gJBSqxCddSH-Ag0&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzke019vYz8CNbvIYOZboG8_sroiZsC2HAlTGtwuB6030xJcdnDP_mLS6faobwmJxvY_4&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFtcNG643qsx7O7RgMzJzNPjzIAV5hXoeNhoFncSSbCayJzLgD9an9VG4AJqG13ocvsIs&usqp=CAU",
  "https://i.redd.it/drzfbk3d4vm41.png",
  "https://w0.peakpx.com/wallpaper/882/550/HD-wallpaper-flat-minimal-morning-landscape-lake-minimalism-morning-minimalist-artist-artwork-digital-art-lake.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2yXcFi_4GRBCqoX5Uv4H78tfaPzYiKBXOAIW1DHyuyMhH8lP0Sh2Lafz0yO-6SfG3hAk&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm-0XLoiK3YV7ErnnKfXhcIChw84DdOubbt_wTP75X2gpkqC9-rxrfavaCviz4JDUSC64&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ8LVQqKHOvtyo42VcNV2XyrHxdpl_Zhh9lgbZLXyVlavFNqo20wS92K1ib-8Ag73VT7A&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Oqxds-c5m48KhjYOKjLGUI6ozgK-VpZLuyTYgwSxEbn827NYZP3-7XziQ6QHb6sgTsw&usqp=CAU",
  "https://i.pinimg.com/originals/f0/cd/2d/f0cd2d87576e3ca24c68cb56f67fe489.jpg",
];

const { width } = Dimensions.get("window");

export const Stories = () => {
  const storiesHorizontalFlatlistRef = useRef<Animated.FlatList<any>>(null);
  const suggestionsFlatlistRef = useRef<Animated.FlatList<any>>(null);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const { start } = useSpotlight();

  return (
    <View>
      <SpotlightScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        <SpotlightFlatList
          ref={storiesHorizontalFlatlistRef}
          data={storiesImages}
          disableVirtualization
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => String(index)}
          contentContainerStyle={{
            paddingHorizontal: 12,
          }}
          horizontal
          renderItem={({ item, index }) => (
            <Step
              tourKeys={["stories-tour", "suggestions-tour"]}
              name={`show-story-${index}`}
              horizontalFlatList={storiesHorizontalFlatlistRef}
              verticalScrollView={scrollViewRef}
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
              {
                name: `show-story-${storiesImages.length - 1}`,
                text: `This is the step number ${storiesImages.length}`,
              },
              {
                name: "show-suggestion-0",
                text: "This is the suggestions number 1",
              },
              { name: "show-story-0", text: "This is the story number 1" },
              {
                name: `show-suggestion-${storiesImages.length - 1}`,
                text: `This is the step number  ${storiesImages.length}`,
              },
            ];

            start("stories-tour", steps);
          }}
        >
          <Text style={styles.startButton}>Start Stories Tutorial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            const steps = [
              {
                name: `show-story-${storiesImages.length - 1}`,
                text: `"This is the story number ${storiesImages.length}`,
              },
              {
                name: `show-suggestion-${storiesImages.length - 1}`,
                text: `"This is the suggestion number ${storiesImages.length}`,
              },
              { name: "show-story-0", text: "This is the step number 1" },
              {
                name: "show-suggestion-0",
                text: "This is the suggestion number 1",
              },
            ];

            start("suggestions-tour", steps);
          }}
        >
          <Text style={styles.startButton}>Start Suggetions Tutorial</Text>
        </TouchableOpacity>
        <SpotlightFlatList
          style={{ marginTop: 400 }}
          ref={suggestionsFlatlistRef}
          data={storiesImages}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => String(index)}
          contentContainerStyle={{
            paddingHorizontal: 12,
          }}
          horizontal
          renderItem={({ item, index }) => (
            <Step
              tourKeys={["suggestions-tour"]}
              name={`show-suggestion-${index}`}
              horizontalFlatList={suggestionsFlatlistRef}
              verticalScrollView={scrollViewRef}
              style={{ marginTop: 24, marginRight: 12 }}
            >
              <View>
                <Image source={{ uri: item }} style={styles.suggestion} />
              </View>
            </Step>
          )}
        />
      </SpotlightScrollView>
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
