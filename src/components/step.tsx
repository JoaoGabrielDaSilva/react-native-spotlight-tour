import React, {
  ReactNode,
  RefObject,
  cloneElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  Dimensions,
  FlatList,
  LayoutRectangle,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
  findNodeHandle,
} from "react-native";
import Animated, { withTiming } from "react-native-reanimated";
import { runTiming } from "@shopify/react-native-skia";
import { SpotlightContext, useSpotlight } from "../contexts/spotlight-provider";

type StepProps<T> = {
  children: ReactNode;
  name: string;
  style?: StyleProp<ViewStyle>;
  verticalScrollView?: RefObject<ScrollView>;
  horizontalScrollView?: RefObject<ScrollView>;
  verticalFlatList?: RefObject<FlatList<T>>;
  horizontalFlatList?: RefObject<FlatList<T>>;
  shape?: string;
  tourKeys: string[];
  onPress?: () => void;
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
  shape = "square",
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
    onPress: spotlightOnPress,
    stepHeight,
    stepWidth,
    stepX,
    opacity,
    activeStepName,
    stepY,
    borderRadius,
    ref,
  } = useSpotlight();

  const stepRef = useRef<View>(null);

  const measureElement = async (): Promise<LayoutRectangle> => {
    return new Promise((res) => {
      stepRef.current?.measure((_, __, width, height, x, y) => {
        res({
          x,
          y,
          width,
          height,
        });
      });
    });
  };

  const needsScrollY = useCallback(
    (y: number, height: number) =>
      y + height > windowHeight ||
      y <
        (scrollY.value > windowHeight
          ? windowHeight - scrollY.value
          : scrollY.value),
    []
  );

  const needsScrollX = useCallback(
    (x: number, width: number) =>
      x + width > windowWidth ||
      x <
        (scrollX.value > windowWidth
          ? windowWidth - scrollX.value
          : scrollX.value),
    []
  );

  const assignOnPress = useCallback(() => {
    if (onPress) {
      spotlightOnPress.current = onPress;
    } else {
      spotlightOnPress.current = undefined;
    }
  }, []);

  const addSpotlightOnElement = useCallback(
    ({ width, height, x, y }: LayoutRectangle, duration = 200) => {
      runTiming(stepX, x - SPOTLIGHT_PADDING / 2, { duration });
      runTiming(
        stepY,
        Platform.OS === "ios"
          ? y - SPOTLIGHT_PADDING / 2
          : y - SPOTLIGHT_PADDING / 2 - 30 + 2,
        {
          duration,
        }
      );
      runTiming(stepWidth, width + SPOTLIGHT_PADDING, { duration });
      runTiming(stepHeight, height + SPOTLIGHT_PADDING, { duration });
    },
    []
  );

  const moveTooltipToElement = useCallback(
    ({ width, height, x, y }: LayoutRectangle) => {
      currentStep.value = {
        width,
        height,
        x,
        y: Platform.OS === "ios" ? y : y - 30,
      };
    },
    []
  );

  const scrollScrollViewYAxis = useCallback((y: number, height: number) => {
    verticalScrollView?.current?.scrollTo({
      y: y - height + SPOTLIGHT_PADDING + (Platform.OS === "android" ? 30 : 0),
    });
  }, []);
  const scrollScrollViewXAxis = useCallback(
    (x: number, timeout = 0) =>
      setTimeout(
        () =>
          horizontalScrollView?.current?.scrollTo({ x: x - SPOTLIGHT_PADDING }),
        timeout
      ),
    []
  );

  const scrollFlatListViewYAxis = useCallback(
    (y: number, height: number) =>
      verticalFlatList?.current?.scrollToOffset({
        offset:
          y - height + SPOTLIGHT_PADDING + (Platform.OS === "android" ? 30 : 0),
      }),
    []
  );

  const scrollFlatListViewXAxis = useCallback(
    (x: number, timeout = 0) =>
      setTimeout(
        () =>
          horizontalFlatList?.current?.scrollToOffset({
            offset: x - SPOTLIGHT_PADDING,
          }),
        timeout
      ),
    []
  );

  const showStepOnTour = async () => {
    const measures = await measureElement();

    const { x, y, width, height } = measures;

    assignOnPress();

    const needsScrollOnYAxis = needsScrollY(y, height);
    const needsScrollOnXAxis = needsScrollX(x, width);

    const needsScroll = needsScrollOnYAxis || needsScrollOnXAxis;

    runTiming(opacity, 1, { duration: 100 });

    if (!needsScroll) {
      borderRadius.current = shape === "square" ? 6 : 300;
      addSpotlightOnElement(measures);

      tooltipProgress.value = withTiming(1, { duration: 200 });
      moveTooltipToElement(measures);
      return;
    }

    runTiming(opacity, 0, { duration: 100 });
    isScrolling.value = withTiming(1);
    tooltipProgress.value = withTiming(0);

    if (needsScrollOnYAxis && verticalScrollView?.current) {
      scrollScrollViewYAxis(y, height);
    }
    if (needsScrollOnXAxis && horizontalScrollView?.current) {
      scrollScrollViewXAxis(x, needsScrollOnYAxis ? SCROLL_TIMEOUT : 0);
    }

    if (needsScrollOnYAxis && verticalFlatList?.current) {
      scrollFlatListViewYAxis(y, height);
    }

    if (needsScrollOnXAxis && horizontalFlatList?.current) {
      scrollFlatListViewXAxis(x, needsScrollOnYAxis ? SCROLL_TIMEOUT : 0);
    }

    setTimeout(() => {
      runTiming(stepHeight, 0, { duration: 100 });
      borderRadius.current = shape === "square" ? 6 : 300;
    }, 200);
    setTimeout(
      async () => {
        const remeasures = await measureElement();

        runTiming(opacity, 1, { duration: 100 });

        addSpotlightOnElement(remeasures, 0);

        moveTooltipToElement(remeasures);

        tooltipProgress.value = withTiming(1);
        isScrolling.value = withTiming(0);
      },
      needsScrollOnXAxis && needsScrollOnYAxis
        ? SCROLL_TIMEOUT * 2
        : SCROLL_TIMEOUT
    );
  };

  const isActive = useCallback(() => {
    const isTourActive = activeTourKey && tourKeys.includes(activeTourKey);

    const isCurrentStep = name === activeStepName;

    const isActive = isEnabled && isCurrentStep && isTourActive;

    return isActive;
  }, [activeStepName, activeTourKey]);

  useEffect(() => {
    if (isActive()) {
      setTimeout(() => showStepOnTour(), 100);
    }
  }, [activeStepName, activeTourKey]);

  return (
    <View style={style} ref={stepRef}>
      {children}
    </View>
  );
};
