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
  Animated,
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

    isScrolling,
    scrollY,
    scrollX,
    tooltipProgress,
    onPress: spotlightOnPress,
    stepPosition,
    stepSize,
    activeStepName,

    ref,
  } = useSpotlight();

  const stepRef = useRef<View>(null);

  const measureElement = async (): Promise<LayoutRectangle> => {
    return new Promise((res) => {
      stepRef.current?.measureLayout(ref.current!, (x, y, width, height) => {
        res({
          x,
          y,
          width,
          height,
        });
      });
    });
  };

  const needsScrollY = useCallback((y: number, height: number) => {
    const scrollYOffset = (scrollY as any)._value as number;

    return (
      y + height > windowHeight ||
      y <
        ((scrollYOffset as number) > windowHeight
          ? windowHeight - scrollYOffset
          : scrollYOffset)
    );
  }, []);

  const needsScrollX = useCallback((x: number, width: number) => {
    const scrollXOffset = (scrollX as any)._value as number;

    return (
      x + width > windowWidth ||
      x <
        (scrollXOffset > windowWidth
          ? windowWidth - scrollXOffset
          : scrollXOffset)
    );
  }, []);

  const assignOnPress = useCallback(() => {
    if (onPress) {
      spotlightOnPress.current = onPress;
    } else {
      spotlightOnPress.current = undefined;
    }
  }, []);

  const moveTooltipToElement = useCallback(
    ({ width, height, x, y }: LayoutRectangle, callback: () => void) => {
      Animated.parallel([
        Animated.timing(stepPosition, {
          toValue: {
            x: x - SPOTLIGHT_PADDING / 2,
            y: y - SPOTLIGHT_PADDING / 2 + (Platform.OS === "ios" ? 0 : -30),
          },
          useNativeDriver: false,
          duration: 300,
        }),
        Animated.timing(stepSize, {
          toValue: {
            x: width + SPOTLIGHT_PADDING,
            y: height + SPOTLIGHT_PADDING,
          },
          useNativeDriver: false,
          duration: 300,
        }),
      ]).start(callback);
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

  const showTooltip = () =>
    Animated.parallel([
      Animated.timing(tooltipProgress, {
        toValue: 1,
        useNativeDriver: false,
        duration: 200,
      }),
      Animated.timing(isScrolling, {
        toValue: 0,
        useNativeDriver: true,
        duration: 200,
      }),
    ]).start();

  const showStepOnTour = async () => {
    const measures = await measureElement();

    const { x, y, width, height } = measures;

    assignOnPress();

    const needsScrollOnYAxis = needsScrollY(y, height);
    const needsScrollOnXAxis = needsScrollX(x, width);

    const needsScroll = needsScrollOnYAxis || needsScrollOnXAxis;

    if (!needsScroll) {
      return moveTooltipToElement(measures, showTooltip);
    }

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

    setTimeout(
      async () => {
        const remeasures = await measureElement();

        moveTooltipToElement(remeasures, () => {
          showTooltip();
        });
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
