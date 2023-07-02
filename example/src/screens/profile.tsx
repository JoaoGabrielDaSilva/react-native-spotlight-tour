import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  Step,
  SpotlightFlatList,
  useSpotlight,
} from "react-native-spotlight-tour-guide";
import { useRef } from "react";
import Animated from "react-native-reanimated";

const images = [
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

export const Profile = () => {
  const flatListRef = useRef<Animated.FlatList<any>>(null);

  const { start } = useSpotlight();

  return (
    <View style={{ flex: 1 }}>
      <SpotlightFlatList
        ref={flatListRef}
        data={images}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item, index }) => (
          <Step
            name={`show-profile-picture-${index}`}
            iosVerticalFlatList={flatListRef}
            tourKeys={["profile-tour"]}
            style={{ margin: 8 }}
          >
            <View>
              <Image
                source={{ uri: item }}
                style={{
                  width: width * 0.33 - 16,
                  height: 155,
                  borderRadius: 6,
                }}
              />
            </View>
          </Step>
        )}
        numColumns={3}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16 }}>
            <TouchableOpacity
              onPress={() => {
                const steps = [
                  {
                    name: "show-user-profile-picture",
                    text: "This is your profile picture",
                  },
                  {
                    name: "show-user-information",
                    text: "This is the information that will be public to anyone",
                  },
                  {
                    name: "show-profile-picture-0",
                    text: "This is your the latest published image",
                  },
                  {
                    name: "show-profile-picture-1",
                    text: "This is the second image of the list",
                  },
                  {
                    name: "show-profile-picture-2",
                    text: "This is the third image of the list",
                  },
                  {
                    name: `show-profile-picture-${images.length - 1}`,
                    text: "And this is the last image of your profile",
                  },
                ];

                start("profile-tour", steps);
              }}
            >
              <Text style={styles.startButton}>Start Tutorial</Text>
            </TouchableOpacity>
            <View style={styles.header}>
              <Step
                name="show-user-profile-picture"
                shape="circle"
                iosVerticalFlatList={flatListRef}
                tourKeys={["profile-tour"]}
                style={{
                  alignSelf: "center",
                }}
              >
                <Image
                  style={styles.image}
                  source={{
                    uri: "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg",
                  }}
                />
              </Step>
              <Step
                name="show-user-information"
                iosVerticalFlatList={flatListRef}
                tourKeys={["profile-tour"]}
                style={{ margin: 24, flex: 1 }}
              >
                <View>
                  <Text style={styles.name}>John Doe</Text>
                  <Text style={styles.age}>20 years old</Text>
                </View>
              </Step>
            </View>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  startButton: {
    alignSelf: "center",
    marginVertical: 24,
  },
  header: {
    flexDirection: "row",
    marginBottom: 24,
  },
  image: { width: 150, height: 150, borderRadius: 100 },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  age: {
    fontSize: 18,
    color: "#4e4e4e",
    fontWeight: "normal",
  },
});
