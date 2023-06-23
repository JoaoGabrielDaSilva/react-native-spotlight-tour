import React, { ReactNode, RefObject, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Animated, { withDelay, withTiming } from "react-native-reanimated";
import { runTiming } from "@shopify/react-native-skia";
import { useSpotlight } from "../contexts/spotlight-provider";

type StepProps<T> = {
  children: ReactNode;
  name: string;
  style?: StyleProp<ViewStyle>;
  scrollView?: RefObject<Animated.ScrollView>;
  flatList?: RefObject<Animated.FlatList<T>>;
  tourKeys: string[];
  onPress?: () => void;
  text: string;
  isActive?: boolean;
};

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const SPOTLIGHT_PADDING = 16;
const SCROLL_TIMEOUT = 500;
const REMEASURE_TIMEOUT = SCROLL_TIMEOUT * 2;

export const Step = <T,>({
  children,
  name,
  style,
  tourKeys,
  scrollView,
  flatList,
  onPress,
  isActive = true,
}: StepProps<T>) => {
  const {
    activeTourKey,
    currentStep,
    isScrolling,
    scrollY,
    scrollX,
    tooltipProgress,
    steps,
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
      console.log(x);
      if (onPress) {
        spotlightOnPress.current = onPress;
      } else {
        spotlightOnPress.current = undefined;
      }

      const isOffScreenOnY =
        y + height > windowHeight ||
        y <
          (scrollY.value > windowHeight
            ? windowHeight - scrollY.value
            : scrollY.value);

      const isOffScreenOnX =
        x > windowWidth ||
        x <
          (scrollX.value > windowWidth
            ? windowWidth - scrollX.value
            : -scrollX.value);

      if (!isOffScreenOnY && !isOffScreenOnX) {
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
        isScrolling.value = withDelay(SCROLL_TIMEOUT, withTiming(0));
      });
      tooltipProgress.value = withTiming(0, {}, () => {
        tooltipProgress.value = withDelay(SCROLL_TIMEOUT + 500, withTiming(1));
      });

      if (scrollView && isOffScreenOnY) {
        scrollView?.current?.scrollTo({ y: y - height });
      }
      if (flatList) {
        // flatList?.current?.scrollToOffset({ offset: y - height });
        setTimeout(
          () => flatList?.current?.scrollToOffset({ offset: x }),
          SCROLL_TIMEOUT
        );
      }

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
      }, REMEASURE_TIMEOUT);
    });

  useEffect(() => {
    const active =
      isActive &&
      name === activeStepName &&
      activeTourKey &&
      tourKeys.includes(activeTourKey);

    if (!!activeTourKey && !steps.some((step) => step.name === name)) {
      console.warn("The current step is not registered in the current tour");
    }

    if (active) {
      setTimeout(() => measureElement(), 100);
    }
  }, [activeStepName, activeTourKey]);

  return (
    <View style={style} ref={stepRef}>
      {children}
    </View>
  );
};
