import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  Step,
  SpotlightFlatList,
  useSpotlight,
} from "react-native-spotlight-tour-guide";
import { useEffect, useRef } from "react";
import Animated from "react-native-reanimated";

const images = [
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR69jZp2GHRMRDekzK6-0T3xs5b6Rcvnp7NVA&usqp=CAU",
  "https://hips.hearstapps.com/hmg-prod/images/screen-shot-2018-07-11-at-5-10-02-pm-1531412351.png?crop=1.00xw:0.667xh;0,0.199xh&resize=1200:*",
  "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?cs=srgb&dl=pexels-marlon-martinez-1450082.jpg&fm=jpg",
];

export const Profile = () => {
  const flatListRef = useRef<Animated.FlatList<any>>(null);

  const { start } = useSpotlight();

  return (
    <SpotlightFlatList
      ref={flatListRef}
      data={images}
      keyExtractor={(_, index) => String(index)}
      renderItem={({ item, index }) => (
        <Step
          name={`show-profile-picutre-${index}`}
          flatList={flatListRef}
          tourKeys={["tour-two"]}
          style={{ marginBottom: 24 }}
        >
          <View>
            <Image
              source={{ uri: item }}
              style={{ width: "100%", height: 155, borderRadius: 12 }}
            />
          </View>
        </Step>
      )}
      contentContainerStyle={{ padding: 16 }}
      ListHeaderComponent={
        <>
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
                  name: "show-profile-picutre-0",
                  text: "This is your the latest published image",
                },
                {
                  name: "show-profile-picutre-1",
                  text: "This is the second image of the list",
                },
                {
                  name: "show-profile-picutre-2",
                  text: "This is the third image of the list",
                },
                {
                  name: "show-profile-picutre-3",
                  text: "And this is the last image of your profile",
                },
              ];

              start("tour-two", steps);
            }}
          >
            <Text style={styles.startButton}>Start Tutorial</Text>
          </TouchableOpacity>
          <View style={styles.header}>
            <Step
              name="show-user-profile-picture"
              flatList={flatListRef}
              tourKeys={["tour-two"]}
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
              flatList={flatListRef}
              tourKeys={["tour-two"]}
              style={{ margin: 24, flex: 1 }}
            >
              <View>
                <Text style={styles.name}>John Doe</Text>
                <Text style={styles.age}>20 years old</Text>
              </View>
            </Step>
          </View>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  startButton: {
    alignSelf: "center",
    marginBottom: 24,
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
