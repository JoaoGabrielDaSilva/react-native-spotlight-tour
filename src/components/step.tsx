import React, { ReactNode, RefObject, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  LayoutRectangle,
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
  verticalScrollView?: RefObject<Animated.ScrollView>;
  horizontalScrollView?: RefObject<Animated.ScrollView>;
  verticalFlatList?: RefObject<FlatList<T>>;
  horizontalFlatList?: RefObject<FlatList<T>>;
  tourKeys: string[];
  onPress?: () => void;
  text: string;
  isEnabled?: boolean;
};

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const SPOTLIGHT_PADDING = 16;
const SCROLL_TIMEOUT = 500;

export const Step = <T,>({
  children,
  name,
  style,
  tourKeys,
  verticalScrollView,
  horizontalScrollView,
  verticalFlatList,
  horizontalFlatList,
  onPress,
  isEnabled = true,
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

  const measureElement = async (): Promise<LayoutRectangle> => {
    return new Promise((res) =>
      stepRef.current?.measure((_, __, width, height, x, y) =>
        res({
          x,
          y,
          width,
          height,
        })
      )
    );
  };

  const needsScrollY = (y: number, height: number) =>
    y + height > windowHeight ||
    y <
      (scrollY.value > windowHeight
        ? windowHeight - scrollY.value
        : scrollY.value);

  const needsScrollX = (x: number, width: number) =>
    x > windowWidth ||
    x <
      (scrollX.value > windowWidth
        ? windowWidth - scrollX.value
        : -scrollX.value);

  const assignOnPress = () => {
    if (onPress) {
      spotlightOnPress.current = onPress;
    } else {
      spotlightOnPress.current = undefined;
    }
  };

  const addSpotlightOnElement = (
    { width, height, x, y }: LayoutRectangle,
    duration = 200
  ) => {
    runTiming(stepX, x - SPOTLIGHT_PADDING / 2, { duration });
    runTiming(
      stepY,
      Platform.OS === "ios"
        ? y - SPOTLIGHT_PADDING / 2
        : y - SPOTLIGHT_PADDING / 2 - 30,
      {
        duration,
      }
    );
    runTiming(stepWidth, width + SPOTLIGHT_PADDING, { duration });
    runTiming(stepHeight, height + SPOTLIGHT_PADDING, { duration });
  };

  const moveTooltipToElement = ({ width, height, x, y }: LayoutRectangle) => {
    currentStep.value = {
      width,
      height,
      x,
      y: Platform.OS === "ios" ? y : y - 30,
    };
  };

  const scrollScrollViewYAxis = (y: number, height: number) =>
    verticalScrollView?.current?.scrollTo({ y: y - height });

  const scrollScrollViewXAxis = (x: number, timeout = 0) =>
    setTimeout(() => horizontalScrollView?.current?.scrollTo({ x }), timeout);

  const scrollFlatListViewYAxis = (y: number, height: number) =>
    verticalFlatList?.current?.scrollToOffset({ offset: y - height });

  const scrollFlatListViewXAxis = (x: number, timeout = 0) =>
    setTimeout(
      () => horizontalFlatList?.current?.scrollToOffset({ offset: x }),
      timeout
    );

  const showStepOnTour = async () => {
    const measures = await measureElement();
    const { x, y, width, height } = measures;

    assignOnPress();

    const needsScrollOnYAxis = needsScrollY(y, height);
    const needsScrollOnXAxis = needsScrollX(x, width);

    const needsScroll = needsScrollOnYAxis || needsScrollOnXAxis;

    if (!needsScroll) {
      addSpotlightOnElement(measures);
      tooltipProgress.value = withTiming(1, { duration: 200 });
      moveTooltipToElement(measures);
      return;
    }

    isScrolling.value = withTiming(1, {});
    tooltipProgress.value = withTiming(0, {});

    const willScrollOnYAxis = verticalScrollView && needsScrollOnYAxis;
    const willScrollOnXAxis = verticalFlatList && needsScrollOnYAxis;

    if (willScrollOnYAxis) {
      scrollScrollViewYAxis(y, height);
    }
    if (horizontalScrollView && needsScrollOnXAxis) {
      scrollScrollViewXAxis(x, willScrollOnYAxis ? SCROLL_TIMEOUT : 0);
    }

    if (willScrollOnXAxis) {
      scrollFlatListViewYAxis(y, height);
    }

    if (horizontalFlatList && needsScrollOnXAxis) {
      scrollFlatListViewXAxis(x, willScrollOnYAxis ? SCROLL_TIMEOUT : 0);
    }

    runTiming(stepHeight, 0, { duration: 100 });
    setTimeout(
      async () => {
        const remeasures = await measureElement();

        addSpotlightOnElement(remeasures, 0);

        moveTooltipToElement(remeasures);
        tooltipProgress.value = withTiming(1);
        isScrolling.value = withTiming(0);
      },
      willScrollOnYAxis ? SCROLL_TIMEOUT * 2 : SCROLL_TIMEOUT
    );
  };

  useEffect(() => {
    const isTourActive = activeTourKey && tourKeys.includes(activeTourKey);

    const isCurrentStep = name === activeStepName;

    const isActive = isEnabled && isCurrentStep && isTourActive;

    if (isActive) {
      setTimeout(() => showStepOnTour(), 100);
    }
  }, [activeStepName, activeTourKey]);

  return (
    <View style={style} ref={stepRef}>
      {children}
    </View>
  );
};
