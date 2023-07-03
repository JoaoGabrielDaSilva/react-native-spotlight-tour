import React, {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  LayoutRectangle,
  Modal,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useSpotlight } from "../contexts/spotlight-provider";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ClipPath, Defs, Path, Rect, Svg } from "react-native-svg";
import { StepShape } from "../types";
import { Tooltip } from "./tooltip";

type StepProps<T> = {
  children: ReactNode;
  name: string;
  style?: StyleProp<ViewStyle>;
  verticalScrollView?: RefObject<ScrollView>;
  horizontalScrollView?: RefObject<ScrollView>;
  iosVerticalFlatList?: RefObject<FlatList<T>>;
  iosHorizontalFlatList?: RefObject<FlatList<T>>;
  tourKeys: string[];
  onPress?: () => void;
  isEnabled?: boolean;
  shape?: StepShape;
  padding?: number;
  borderRadius?: number;
};

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const SCROLL_TIMEOUT = 500;
const EXTRA_SCROLL_OFFSET = 8;

export const Step = <T,>({
  children,
  name,
  style,
  tourKeys,
  verticalScrollView,
  horizontalScrollView,
  iosVerticalFlatList,
  iosHorizontalFlatList,
  onPress,
  shape,
  padding = 0,
  borderRadius,
  isEnabled = true,
}: StepProps<T>) => {
  const {
    activeTourKey,
    onPress: spotlightOnPress,
    activeStepName,
    stop,
    scrollX,
    scrollY,
  } = useSpotlight();

  const [rerender, setRerender] = useState(false);
  const [stepMeasures, setStepMeasures] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const spotlightRef = useRef<Rect>(null);

  const tooltipProgress = useSharedValue(0);

  const stepRef = useRef<View>(null);

  const measureElement = async (): Promise<LayoutRectangle> => {
    return new Promise((res, rej) => {
      stepRef.current?.measure(
        (_, __, width, height, x, y) => {
          if (
            width === undefined ||
            height === undefined ||
            x === undefined ||
            y === undefined
          ) {
            rej(
              new Error(
                `The step ${name} won't work on android because it cannot be measured since it's offscreen and inside a FlatList`
              )
            );
          }
          res({
            x,
            y,
            width,
            height,
          });
        },
        //@ts-ignore next-line
        (e) => console.log(e)
      );
    });
  };

  const needsScrollY = useCallback((y: number, height: number) => {
    return (
      y + height > windowHeight ||
      y <
        (scrollY.value > windowHeight
          ? windowHeight - scrollY.value
          : scrollY.value)
    );
  }, []);

  const needsScrollX = useCallback((x: number, width: number) => {
    return (
      x + width > windowWidth ||
      x <
        (scrollX.value > windowWidth
          ? windowWidth - scrollX.value
          : scrollX.value)
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
    ({ width, height, x, y }: LayoutRectangle) => {
      const data = {
        x: x - padding / 2,
        y: y - padding / 2 + (Platform.OS === "ios" ? 0 : -28),
        width: width + padding,
        height: height + padding,
      };

      setStepMeasures(data);

      tooltipProgress.value = withTiming(1);
      if (Platform.OS === "android") {
        setRerender((r) => !r);
      } else {
        spotlightRef?.current?.setNativeProps({
          ...data,
          rx: shape === StepShape.CIRCLE ? width + padding : borderRadius || 0,
        });
      }
    },
    []
  );

  const scrollScrollViewYAxis = useCallback((y: number, height: number) => {
    verticalScrollView?.current?.scrollTo({
      y:
        y -
        height +
        padding +
        EXTRA_SCROLL_OFFSET +
        (Platform.OS === "android" ? 28 : 0),
    });
  }, []);
  const scrollScrollViewXAxis = useCallback(
    (x: number, timeout = 0) =>
      setTimeout(
        () => horizontalScrollView?.current?.scrollTo({ x: x - padding }),
        timeout
      ),
    []
  );

  const scrollFlatListViewYAxis = useCallback(
    (y: number, height: number) =>
      iosVerticalFlatList?.current?.scrollToOffset({
        offset:
          y -
          height +
          padding +
          EXTRA_SCROLL_OFFSET +
          (Platform.OS === "android" ? 28 : 0),
      }),
    []
  );

  const scrollFlatListViewXAxis = useCallback(
    (x: number, timeout = 0) =>
      setTimeout(
        () =>
          iosHorizontalFlatList?.current?.scrollToOffset({
            offset: x - padding,
          }),
        timeout
      ),
    []
  );

  const showStepOnTour = async () => {
    try {
      tooltipProgress.value = withTiming(0);
      const measures = await measureElement();

      const { x, y, width, height } = measures;

      assignOnPress();

      const needsScrollOnYAxis = needsScrollY(y, height);
      const needsScrollOnXAxis = needsScrollX(x, width);

      const needsScroll = needsScrollOnYAxis || needsScrollOnXAxis;

      if (!needsScroll) {
        return moveTooltipToElement(measures);
      }

      if (needsScrollOnYAxis && verticalScrollView?.current) {
        scrollScrollViewYAxis(y, height);
      }
      if (needsScrollOnXAxis && horizontalScrollView?.current) {
        scrollScrollViewXAxis(x, needsScrollOnYAxis ? SCROLL_TIMEOUT : 0);
      }

      if (needsScrollOnYAxis && iosVerticalFlatList?.current) {
        scrollFlatListViewYAxis(y, height);
      }

      if (needsScrollOnXAxis && iosHorizontalFlatList?.current) {
        scrollFlatListViewXAxis(x, needsScrollOnYAxis ? SCROLL_TIMEOUT : 0);
      }

      setTimeout(
        async () => {
          const remeasures = await measureElement();

          moveTooltipToElement(remeasures);
        },
        needsScrollOnXAxis && needsScrollOnYAxis
          ? SCROLL_TIMEOUT * 2
          : SCROLL_TIMEOUT
      );
    } catch (error) {
      console.warn((error as Error).message);
      stop();
    }
  };

  const isActive = useCallback(() => {
    const isTourActive = activeTourKey && tourKeys.includes(activeTourKey);

    const isCurrentStep = name === activeStepName;

    const isActive = isEnabled && isCurrentStep && isTourActive;

    return !!isActive;
  }, [activeStepName, activeTourKey, stepMeasures]);

  useEffect(() => {
    if (isActive()) {
      setTimeout(() => showStepOnTour(), 100);
    } else {
      tooltipProgress.value = 0;
    }
  }, [activeStepName, activeTourKey]);

  return (
    <View style={style} ref={stepRef}>
      <Modal transparent visible={isActive()} animationType="fade">
        <Svg style={{ flex: 1 }}>
          <Defs>
            <ClipPath id="clip_out" key={String(rerender)}>
              <Rect x={0} y={0} width={windowWidth} height={windowHeight} />
              <Rect
                ref={spotlightRef}
                x={stepMeasures.x}
                y={stepMeasures.y}
                width={stepMeasures.width}
                height={stepMeasures.height}
                rx={
                  shape === StepShape.CIRCLE
                    ? stepMeasures.width + padding
                    : borderRadius || 0
                }
              />
            </ClipPath>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={windowWidth}
            height={windowHeight}
            clipPath="url(#clip_out)"
            fill="#00000060"
          />
        </Svg>
        <Tooltip
          stepMeasures={stepMeasures}
          padding={padding}
          tooltipProgress={tooltipProgress}
        />
      </Modal>
      {children}
    </View>
  );
};
