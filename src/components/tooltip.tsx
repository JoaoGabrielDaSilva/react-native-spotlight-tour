import React from "react";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Dimensions,
  LayoutRectangle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StepLayout } from "../types";

type TooltipProps = {
  currentStep: SharedValue<StepLayout | null>;
  tooltipProgress: SharedValue<number>;
  scrollProgress: SharedValue<number>;
  spotlightPadding: number;
  text: string;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  previous: () => void;
  stop: () => void;
};

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const Tooltip = ({
  currentStep,
  spotlightPadding,
  text,
  tooltipProgress,
  scrollProgress,
  isFirst,
  isLast,
  next,
  previous,
  stop,
}: TooltipProps) => {
  const tooltipLayout = useSharedValue<LayoutRectangle>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const tooltipAnimatedStyles = useAnimatedStyle(() => {
    const TOP_SPOTLIGHT_PADDING = spotlightPadding;
    const TOOLTIP_SPACING = spotlightPadding;

    const bottomPosition =
      (currentStep?.value?.y || 0) +
      (currentStep?.value?.height || 0) +
      TOOLTIP_SPACING;

    const topPosition =
      (currentStep?.value?.y || 0) -
      tooltipLayout.value.height -
      TOP_SPOTLIGHT_PADDING;

    const shouldPositionTop = bottomPosition >= windowHeight - 100;

    return {
      top: scrollProgress.value
        ? shouldPositionTop
          ? topPosition
          : bottomPosition
        : withTiming(shouldPositionTop ? topPosition : bottomPosition),
      opacity: tooltipProgress.value,
    };
  });

  return (
    <Animated.View
      style={[tooltipAnimatedStyles, styles.container]}
      onLayout={({ nativeEvent }) => (tooltipLayout.value = nativeEvent.layout)}
    >
      <Text>{text}</Text>
      <TooltipButtons
        isFirst={isFirst}
        isLast={isLast}
        stop={stop}
        next={next}
        previous={previous}
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
};

const TooltipButtons = ({
  isFirst,
  isLast,
  next,
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
        <TouchableOpacity onPress={stop}>
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
