import { StyleSheet, Text, TouchableOpacity } from "react-native";
import {
  Step,
  SpotlightScrollView,
  useSpotlight,
} from "react-native-spotlight-tour";
import { useRef } from "react";
import Animated from "react-native-reanimated";

export const Home = () => {
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const { start } = useSpotlight();

  return (
    <SpotlightScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ padding: 16 }}
    >
      <TouchableOpacity onPress={() => start("tour-one", 7)}>
        <Text style={styles.startButton}>Start Tutorial</Text>
      </TouchableOpacity>

      <Step
        order={4}
        text="Here you can see the people that follow you"
        scrollView={scrollViewRef}
        tourKey="tour-one"
        style={{ marginTop: 200 }}
      >
        <Text style={[styles.tourOneText]}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quas
          architecto, voluptate alias doloremque magni labore officiis similique
          libero, tenetur, aliquam eos obcaecati! A iure hic dolorem, beatae
          voluptatem suscipit.
        </Text>
      </Step>
      <Step
        order={3}
        text="This is the summary of all your views"
        scrollView={scrollViewRef}
        tourKey="tour-one"
        style={{ marginTop: 200 }}
      >
        <Text style={[styles.tourOneText]}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quas
          architecto, voluptate alias doloremque magni labore officiis similique
          libero, tenetur, aliquam eos obcaecati! A iure hic dolorem, beatae
          voluptatem suscipit.
        </Text>
      </Step>
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
      <Step
        order={2}
        tourKey="tour-one"
        text="Here you can see the stuff that you posted"
        scrollView={scrollViewRef}
      >
        <Text style={styles.tourOneText}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quas
          architecto, voluptate alias doloremque magni labore officiis similique
          libero, tenetur, aliquam eos obcaecati! A iure hic dolorem, beatae
          voluptatem suscipit.
        </Text>
      </Step>

      <Step
        order={1}
        text="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium quos mollitia reprehenderit? Atque optio maiores quia hic tenetur dolorem, labore provident reprehenderit cupiditate incidunt magni, quaerat reiciendis quibusdam quod quisquam?"
        tourKey="tour-one"
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
