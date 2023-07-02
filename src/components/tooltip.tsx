import React, { useEffect, useRef, useState } from "react";

import {
  Dimensions,
  LayoutRectangle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSpotlight } from "../contexts/spotlight-provider";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

type TooltipProps = {
  stepMeasures: LayoutRectangle;
  padding: number;
  tooltipProgress: SharedValue<number>;
};

const SPACING = 8;

export const Tooltip = ({
  stepMeasures,
  padding,
  tooltipProgress,
}: TooltipProps) => {
  const tooltipHeight = useSharedValue(0);

  const { steps, previous, next, text, stepIndex, stop, onPress } =
    useSpotlight();

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  const animatedStyles = useAnimatedStyle(() => {
    const bottom = stepMeasures.y + stepMeasures.height + padding + SPACING;
    const top = stepMeasures.y - tooltipHeight.value - padding - SPACING;

    const shouldPositionTop = bottom >= windowHeight - 150;

    return {
      top: shouldPositionTop ? top : bottom,
      opacity: tooltipProgress.value,
    };
  });

  return (
    <Animated.View
      style={[styles.container, animatedStyles]}
      onLayout={({ nativeEvent }) =>
        (tooltipHeight.value = nativeEvent.layout.height)
      }
    >
      <Text>{text}</Text>
      <TooltipButtons
        isFirst={isFirst}
        isLast={isLast}
        stop={stop}
        next={() => {
          if (onPress.current) onPress.current();

          next();
        }}
        previous={previous}
        onFinish={() => {
          if (onPress.current) onPress.current();

          stop();
        }}
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
    zIndex: 999,
    left: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    position: "absolute",
    borderRadius: 5,
  },
});
