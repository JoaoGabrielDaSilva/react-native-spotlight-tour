import { Image, StyleSheet, Text } from "react-native";
import { Step, SpotlightScrollView } from "react-native-spotlight-tour";
import { useRef } from "react";

import Animated from "react-native-reanimated";

export const Profile = () => {
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  return (
    <SpotlightScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ padding: 16 }}
    >
      <Step
        order={6}
        scrollView={scrollViewRef}
        text="Here is your profile picture"
        tourKey="tour-one"
        style={{
          marginTop: 200,
          marginBottom: 100,
          alignSelf: "center",
        }}
      >
        <Image
          style={{ width: 200, height: 200, borderRadius: 100 }}
          source={{
            uri: "https://wallpapers.com/images/hd/cute-anime-profile-pictures-1uajidyr4s2a1l28.jpg",
          }}
        />
      </Step>

      <Text style={[styles.tourOneText]}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quas
        architecto, voluptate alias doloremque magni labore officiis similique
        libero, tenetur, aliquam eos obcaecati! A iure hic dolorem, beatae
        voluptatem suscipit.
      </Text>
      <Text style={{ marginTop: 200 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quas
        architecto, voluptate alias doloremque magni labore officiis similique
        libero, tenetur, aliquam eos obcaecati! A iure hic dolorem, beatae
        voluptatem suscipit.
      </Text>
      <Text style={{ marginTop: 200 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quas
        architecto, voluptate alias doloremque magni labore officiis similique
        libero, tenetur, aliquam eos obcaecati! A iure hic dolorem, beatae
        voluptatem suscipit.
      </Text>
      <Text style={{ marginTop: 200 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quas
        architecto, voluptate alias doloremque magni labore officiis similique
        libero, tenetur, aliquam eos obcaecati! A iure hic dolorem, beatae
        voluptatem suscipit.
      </Text>
      <Text style={{ marginTop: 200 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quas
        architecto, voluptate alias doloremque magni labore officiis similique
        libero, tenetur, aliquam eos obcaecati! A iure hic dolorem, beatae
        voluptatem suscipit.
      </Text>
      <Text style={styles.tourOneText}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quas
        architecto, voluptate alias doloremque magni labore officiis similique
        libero, tenetur, aliquam eos obcaecati! A iure hic dolorem, beatae
        voluptatem suscipit.
      </Text>

      <Step
        order={7}
        tourKey="tour-one"
        text="And this is the end of the tour"
        scrollView={scrollViewRef}
        style={{ marginTop: 200 }}
      >
        <Text style={styles.tourOneText}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quas
          architecto, voluptate alias doloremque magni labore officiis similique
          libero, tenetur, aliquam eos obcaecati! A iure hic dolorem, beatae
          voluptatem suscipit.
        </Text>
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
