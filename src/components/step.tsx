import React, { ReactNode, RefObject, useEffect, useRef } from "react";
import { Dimensions, StyleProp, View, ViewStyle } from "react-native";
import { useSpotlight } from "../contexts/spotlight-provider";
import Animated, { withDelay, withTiming } from "react-native-reanimated";
import { runTiming } from "@shopify/react-native-skia";

type StepProps = {
  children: ReactNode;
  order: number;
  style?: StyleProp<ViewStyle>;
  scrollView?: RefObject<Animated.ScrollView>;
  tourKey: string;
  onPress?: () => void;
  text: string;
};

const { height: windowHeight } = Dimensions.get("window");

const SCROLL_TIMEOUT = 500;

export const Step = ({
  children,
  order,
  style,
  tourKey,
  scrollView,
  text,
  onPress,
}: StepProps) => {
  const {
    activeTourKey,
    stepIndex,
    currentStep,
    isScrolling,
    scrollY,
    tooltipProgress,
    onPress: spotlightOnPress,
    setText,
    stepHeight,
    stepWidth,
    stepX,
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
      setText(text);

      const isOffScreenOnY =
        y > windowHeight ||
        y <
          (scrollY.value > windowHeight
            ? windowHeight - scrollY.value
            : scrollY.value);

      if (!isOffScreenOnY) {
        runTiming(stepX, x, { duration: 200 });
        runTiming(stepY, y, { duration: 200 });
        runTiming(stepWidth, width, { duration: 200 });
        runTiming(stepHeight, height, { duration: 200 });

        return (currentStep.value = {
          width,
          height,
          x,
          y,
        });
      }

      isScrolling.value = withTiming(1, {}, () => {
        isScrolling.value = withTiming(0, { duration: SCROLL_TIMEOUT });
      });
      tooltipProgress.value = withTiming(0, {}, () => {
        tooltipProgress.value = withDelay(
          SCROLL_TIMEOUT,
          withTiming(1, { duration: 200 })
        );
      });

      scrollView?.current?.scrollTo({ y: y - height });

      setTimeout(() => {
        stepRef.current?.measure((_, __, width, height, x, y) => {
          runTiming(stepX, x, { duration: 200 });
          runTiming(stepY, y, { duration: 200 });
          runTiming(stepWidth, width, { duration: 200 });
          runTiming(stepHeight, height, { duration: 200 });

          currentStep.value = {
            width,
            height,
            x,
            y,
          };
        });
      }, SCROLL_TIMEOUT);
    });

  useEffect(() => {
    const isActive = activeTourKey === tourKey && order === stepIndex;
    if (isActive) {
      setTimeout(() => measureElement(), 100);
    }
  }, [activeTourKey, stepIndex]);

  return (
    <View style={style} ref={stepRef}>
      {children}
    </View>
  );
};
