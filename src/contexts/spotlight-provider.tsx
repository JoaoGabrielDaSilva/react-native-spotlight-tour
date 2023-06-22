import React, {
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { Step } from "../types";
import { Dimensions, Modal, Pressable } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Tooltip } from "../components/tooltip";
import {
  Canvas,
  useComputedValue,
  Path as SkiaPath,
  useValue,
  SkiaMutableValue,
  useClockValue,
  Skia,
} from "@shopify/react-native-skia";

type SpotlightContext = {
  stepIndex: number;
  currentStep: SharedValue<Step | null>;
  isScrolling: SharedValue<number>;
  scrollY: SharedValue<number>;
  activeTourKey: string | null;
  next: () => void;
  previous: () => void;
  start: (tourKey: string, numberOfSteps: number) => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onPress: MutableRefObject<(() => void) | undefined>;
  tooltipProgress: SharedValue<number>;
  stepX: SkiaMutableValue<number>;
  stepY: SkiaMutableValue<number>;
  stepWidth: SkiaMutableValue<number>;
  stepHeight: SkiaMutableValue<number>;
};

const SpotlightContext = createContext({} as SpotlightContext);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const SPOTLIGHT_PADDING = 16;

export const SpotlightProvider = ({ children }: { children: ReactNode }) => {
  const [stepIndex, setStepIndex] = useState(1);
  const [tourKey, setTourkey] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [numberOfSteps, setNumberOfSteps] = useState(0);
  const tooltipProgress = useSharedValue(0);

  const stepX = useValue(0);
  const stepY = useValue(0);
  const stepWidth = useValue(0);
  const stepHeight = useValue(0);

  const onPress = useRef<(() => void) | undefined>(undefined);

  const currentStep = useSharedValue<Step | null>(null);
  const isScrolling = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const start = (tourKey: string, numberSteps: number) => {
    setTourkey(tourKey);
    setStepIndex(1);
    setNumberOfSteps(numberSteps);
  };
  const stop = () => {
    setTourkey(null);
    setStepIndex(1);
    setNumberOfSteps(0);
    tooltipProgress.value = 0;
  };

  const next = () => {
    if (onPress?.current) {
      onPress.current();
    }
    setStepIndex((state) => state + 1);
  };

  const previous = () => {
    setStepIndex((state) => {
      if (state >= 1) {
        return state - 1;
      }
      return state;
    });
  };

  const clock = useClockValue();

  const path = useComputedValue(() => {
    if (isScrolling.value)
      return `M0,0H${windowWidth}V${windowHeight}H0V0ZM${0},${0}`;

    const p = Skia.Path.Make();

    return `M0,0H${windowWidth}V${windowHeight}H0V0ZM${
      stepX.current - SPOTLIGHT_PADDING / 2
    },${stepY.current - SPOTLIGHT_PADDING / 2}H${
      stepX.current -
      SPOTLIGHT_PADDING / 2 +
      stepWidth.current +
      SPOTLIGHT_PADDING
    }V${
      stepY.current -
      SPOTLIGHT_PADDING / 2 +
      stepHeight.current +
      SPOTLIGHT_PADDING
    }H${stepX.current - SPOTLIGHT_PADDING / 2}V${
      stepY.current - SPOTLIGHT_PADDING / 2
    }Z`;
  }, [clock]);

  const animatedPressableStyles = useAnimatedStyle(() => {
    return {
      width: stepWidth.current + SPOTLIGHT_PADDING,
      height: stepHeight.current + SPOTLIGHT_PADDING,
      left: stepX.current - SPOTLIGHT_PADDING / 2,
      top: stepY.current - SPOTLIGHT_PADDING / 2,
    };
  }, [stepHeight.current]);

  return (
    <SpotlightContext.Provider
      value={{
        stepIndex,
        tooltipProgress,
        activeTourKey: tourKey,
        isScrolling,
        currentStep,
        scrollY,
        onPress,
        text,
        stepX,
        stepY,
        stepWidth,
        stepHeight,
        setText,
        next,
        previous,
        start,
      }}
    >
      <Modal transparent visible={!!tourKey}>
        <Canvas style={{ flex: 1 }}>
          <SkiaPath color="#00000060" fillType="evenOdd" path={path} />
        </Canvas>
        <AnimatedPressable
          style={[animatedPressableStyles, { position: "absolute" }]}
          onPress={next}
        />
        <Tooltip
          currentStep={currentStep}
          spotlightPadding={SPOTLIGHT_PADDING}
          tooltipProgress={tooltipProgress}
          text={text}
          isFirst={stepIndex === 1}
          isLast={stepIndex === numberOfSteps}
          stop={stop}
          next={next}
          previous={previous}
        />
      </Modal>
      {children}
    </SpotlightContext.Provider>
  );
};

export const useSpotlight = () => useContext(SpotlightContext);
