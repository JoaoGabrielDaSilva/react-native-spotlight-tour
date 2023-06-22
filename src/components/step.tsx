import React, { ReactNode, RefObject, useEffect, useRef } from "react";
import { Dimensions, Platform, StyleProp, View, ViewStyle } from "react-native";
import Animated, { withDelay, withTiming } from "react-native-reanimated";
import { runTiming } from "@shopify/react-native-skia";
import { useSpotlight } from "../contexts/spotlight-provider";

type StepProps = {
  children: ReactNode;
  name: string;
  style?: StyleProp<ViewStyle>;
  scrollView?: RefObject<Animated.ScrollView>;
  tourKeys: string[];
  onPress?: () => void;
  text: string;
};

const { height: windowHeight } = Dimensions.get("window");

const SCROLL_TIMEOUT = 500;
const SPOTLIGHT_PADDING = 16;

export const Step = ({
  children,
  name,
  style,
  tourKeys,
  scrollView,

  onPress,
}: StepProps) => {
  const {
    activeTourKey,
    currentStep,
    isScrolling,
    scrollY,
    tooltipProgress,
    onPress: spotlightOnPress,
    stepHeight,
    stepWidth,
    stepX,
    activeStepName,
    stepY,
  } = useSpotlight();

  const stepRef = useRef<View>(null);

  const measureElement = () =>
    stepRef.current?.measure((_, __, width, height, x, y) => {
      if (onPress) {
        spotlightOnPress.current = onPress;
      } else {
        spotlightOnPress.current = undefined;
      }

      const isOffScreenOnY =
        y > windowHeight ||
        y <
          (scrollY.value > windowHeight
            ? windowHeight - scrollY.value
            : scrollY.value);

      if (!isOffScreenOnY) {
        runTiming(stepX, x - SPOTLIGHT_PADDING / 2, { duration: 200 });
        runTiming(
          stepY,
          Platform.OS === "ios"
            ? y - SPOTLIGHT_PADDING / 2
            : y - SPOTLIGHT_PADDING / 2 - 30,
          {
            duration: 200,
          }
        );
        runTiming(stepWidth, width + SPOTLIGHT_PADDING, { duration: 200 });
        runTiming(stepHeight, height + SPOTLIGHT_PADDING, { duration: 200 });

        tooltipProgress.value = withTiming(1, { duration: 200 });

        return (currentStep.value = {
          width,
          height,
          x,
          y: Platform.OS === "ios" ? y : y - 30,
        });
      }

      isScrolling.value = withTiming(1, {}, () => {
        isScrolling.value = withTiming(0, { duration: SCROLL_TIMEOUT });
      });
      tooltipProgress.value = withTiming(0, {}, () => {
        tooltipProgress.value = withTiming(1, { duration: SCROLL_TIMEOUT });
      });

      scrollView?.current?.scrollTo({ y: y - height });

      runTiming(stepHeight, 0, { duration: 100 });
      setTimeout(() => {
        stepRef.current?.measure((_, __, width, height, x, y) => {
          stepX.current = x - SPOTLIGHT_PADDING / 2;
          stepY.current =
            Platform.OS === "ios"
              ? y - SPOTLIGHT_PADDING / 2
              : y - SPOTLIGHT_PADDING / 2 - 30;

          stepWidth.current = width + SPOTLIGHT_PADDING;
          stepHeight.current = height + SPOTLIGHT_PADDING;

          currentStep.value = {
            width,
            height,
            x,
            y: Platform.OS === "ios" ? y : y - 30,
          };
        });
      }, SCROLL_TIMEOUT);
    });

  useEffect(() => {
    const isActive =
      name === activeStepName &&
      activeTourKey &&
      tourKeys.includes(activeTourKey);
    if (isActive) {
      setTimeout(() => measureElement(), 100);
    }
  }, [activeStepName, activeTourKey]);

  return (
    <View style={style} ref={stepRef}>
      {children}
    </View>
  );
};
