import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  Dimensions,
  LayoutRectangle,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";

type TooltipProps = {
  stepPosition: Animated.ValueXY;
  stepSize: Animated.ValueXY;
  tooltipProgress: Animated.Value;
  scrollProgress: Animated.Value;
  spotlightPadding: number;
  text: string;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  previous: () => void;
  stop: () => void;
  onFinish: () => void;
};

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const Tooltip = ({
  stepPosition,
  stepSize,
  spotlightPadding,
  text,
  tooltipProgress,
  scrollProgress,
  isFirst,
  isLast,
  next,
  onFinish,
  previous,
  stop,
}: TooltipProps) => {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const topPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = stepPosition.addListener((value) => {
      // console.log(value.y + tooltipHeight + spotlightPadding);
      const bottom = value.y + stepSize.y?._value + spotlightPadding;
      const top = value.y - tooltipHeight - spotlightPadding;

      const shouldPositionTop = bottom >= windowHeight - 150;

      topPosition.setValue(shouldPositionTop ? top : bottom);
    });

    return () => {
      stepPosition.removeListener(id);
    };
  }, [stepPosition, tooltipHeight]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: topPosition,
          opacity: tooltipProgress,
        },
      ]}
      onLayout={({ nativeEvent }) =>
        setTooltipHeight(nativeEvent.layout.height)
      }
    >
      <Text>{text}</Text>
      <TooltipButtons
        isFirst={isFirst}
        isLast={isLast}
        stop={stop}
        next={next}
        previous={previous}
        onFinish={onFinish}
      />
    </Animated.View>
  );
};

type TooltipButtonsProps = {
  isFirst: boolean;
  isLast: boolean;
  stop: () => void;
  next: () => void;
  previous: () => void;
  onFinish: () => void;
};

const TooltipButtons = ({
  isFirst,
  isLast,
  next,
  onFinish,
  previous,
  stop,
}: TooltipButtonsProps) => (
  <View style={buttonStyles.container}>
    <TouchableOpacity onPress={stop}>
      <Text style={buttonStyles.text}>Skip</Text>
    </TouchableOpacity>
    <View style={buttonStyles.content}>
      {!isFirst ? (
        <TouchableOpacity onPress={previous}>
          <Text style={buttonStyles.text}>Previous</Text>
        </TouchableOpacity>
      ) : null}
      {!isLast ? (
        <TouchableOpacity onPress={next}>
          <Text style={buttonStyles.text}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onFinish}>
          <Text style={buttonStyles.text}>Finish</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const buttonStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: "#1773dd",
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    width: windowWidth - 16,
    left: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    position: "absolute",
    borderRadius: 5,
  },
});
