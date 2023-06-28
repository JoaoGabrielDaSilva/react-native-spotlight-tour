import { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal as RNModal,
} from "react-native";

import { Step, useSpotlight } from "react-native-spotlight-tour-guide";

const { width } = Dimensions.get("window");

export const Modal = () => {
  const { start, next } = useSpotlight();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);

  const close = () => setIsOpen(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          const steps = [
            {
              name: "show-open-modal-button",
              text: "This is the button that opens the",
            },
            { name: "show-modal-body", text: "This is the modal body" },
            { name: "show-modal-title", text: "This is the modal title" },
            { name: "show-modal-content", text: "This is the modal content" },
            {
              name: "show-modal-close",
              text: "This is the button that closes the modal",
            },
          ];

          start("modal-tour", steps);
        }}
      >
        <Text style={styles.button}>Start Modal Tutorial</Text>
      </TouchableOpacity>

      <Step
        name="show-open-modal-button"
        tourKeys={["modal-tour"]}
        style={styles.button}
        onPress={openModal}
      >
        <TouchableOpacity onPress={openModal}>
          <Text>Open Modal</Text>
        </TouchableOpacity>
      </Step>
      <RNModal transparent visible={isOpen}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000060",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Step
            name="show-modal-body"
            tourKeys={["modal-tour"]}
            style={styles.button}
            onPress={openModal}
          >
            <View
              style={{
                width: "80%",
                backgroundColor: "#FFFFFF",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <Step
                name="show-modal-title"
                tourKeys={["modal-tour"]}
                style={styles.button}
                onPress={openModal}
              >
                <Text
                  style={{
                    textAlign: "center",
                    marginBottom: 24,
                    fontSize: 20,
                  }}
                >
                  Title
                </Text>
              </Step>
              <Step
                name="show-modal-content"
                tourKeys={["modal-tour"]}
                style={styles.button}
                onPress={openModal}
              >
                <Text>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Deserunt rem soluta voluptatibus in dolorem laudantium, quo
                  aperiam est expedita nostrum, illo repellendus voluptate
                  eveniet quibusdam! Sequi officiis odit molestiae?
                  Perspiciatis.
                </Text>
              </Step>
            </View>
          </Step>
        </View>
      </RNModal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
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
