import React, {
  MutableRefObject,
  ReactNode,
  RefObject,
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Step, StepLayout } from "../types";
import { Dimensions, Modal, View } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { Tooltip } from "../components/tooltip";
import {
  Canvas,
  useValue,
  SkiaMutableValue,
  useClockValue,
  Mask,
  Group,
  Rect,
  runTiming,
  RoundedRect,
} from "@shopify/react-native-skia";

type SpotlightContext = {
  stepIndex: number | null;
  currentStep: SharedValue<StepLayout | null>;
  isScrolling: SharedValue<number>;
  scrollY: SharedValue<number>;
  scrollX: SharedValue<number>;
  activeTourKey: string | null;
  next: () => void;
  previous: () => void;
  start: (tourKey: string, steps: Step[]) => void;
  text: string;
  steps: Step[];
  setText: React.Dispatch<React.SetStateAction<string>>;
  onPress: MutableRefObject<(() => void) | undefined>;
  tooltipProgress: SharedValue<number>;
  stepX: SkiaMutableValue<number>;
  stepY: SkiaMutableValue<number>;
  stepWidth: SkiaMutableValue<number>;
  stepHeight: SkiaMutableValue<number>;
  borderRadius: SkiaMutableValue<number>;
  opacity: SkiaMutableValue<number>;
  activeStepName: string;
  setActiveStepName: React.Dispatch<React.SetStateAction<string>>;
  ref: RefObject<View>;
};

export const SpotlightContext = createContext({} as SpotlightContext);

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const SPOTLIGHT_PADDING = 16;

export const SpotlightProvider = ({ children }: { children: ReactNode }) => {
  const ref = useRef<View>(null);

  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [tourKey, setTourkey] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [activeStepName, setActiveStepName] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const tooltipProgress = useSharedValue(0);
  const borderRadius = useValue(4);
  const opacity = useValue(0);

  const stepX = useValue(windowWidth / 2);
  const stepY = useValue(0);
  const stepWidth = useValue(0);
  const stepHeight = useValue(0);

  const onPress = useRef<(() => void) | undefined>(undefined);

  const currentStep = useSharedValue<StepLayout | null>(null);
  const isScrolling = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const scrollX = useSharedValue(0);

  const start = useCallback((tourKey: string, steps: Step[]) => {
    setTourkey(tourKey);
    setStepIndex(0);
    setSteps(steps);
    setActiveStepName("");
  }, []);

  const stop = useCallback(() => {
    setTourkey(null);
    setStepIndex(null);
    setSteps([]);
    onPress.current = undefined;
    currentStep.value = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    };
    scrollX.value = 0;
    scrollY.value = 0;
    tooltipProgress.value = 0;
    stepX.current = windowWidth / 2;
    stepY.current = 0;
    stepWidth.current = 0;
    stepHeight.current = 0;
  }, []);

  const next = useCallback(() => {
    if (onPress?.current) {
      onPress.current();
    }
    setStepIndex((state) => (state !== null ? state + 1 : state));
  }, []);

  const previous = useCallback(
    () =>
      setStepIndex((state) =>
        state !== null && state - 1 >= 0 ? state - 1 : state
      ),
    []
  );

  useEffect(() => {
    if (stepIndex !== null) {
      const activeStep = steps[stepIndex];
      setActiveStepName(activeStep.name);
      setText(activeStep.text);
    }
  }, [stepIndex, steps]);

  return (
    <SpotlightContext.Provider
      value={{
        stepIndex,
        tooltipProgress,
        activeStepName,
        borderRadius,
        setActiveStepName,
        activeTourKey: tourKey,
        isScrolling,
        currentStep,
        scrollY,
        scrollX,
        opacity,
        onPress,
        text,
        stepX,
        stepY,
        steps,
        stepWidth,
        stepHeight,
        ref,
        setText,
        next,
        previous,
        start,
      }}
    >
      <Modal transparent visible={!!tourKey}>
        <Canvas style={{ flex: 1 }}>
          <Mask
            mode="luminance"
            mask={
              <Group>
                <Rect
                  x={0}
                  y={0}
                  width={windowWidth}
                  height={windowHeight}
                  color="white"
                />
                <RoundedRect
                  r={borderRadius}
                  x={stepX}
                  y={stepY}
                  width={stepWidth}
                  height={stepHeight}
                  color="black"
                  opacity={opacity}
                />
              </Group>
            }
          >
            <Rect
              x={0}
              y={0}
              width={windowWidth}
              height={windowHeight}
              color="#0000008b"
            />
          </Mask>
        </Canvas>

        <Tooltip
          currentStep={currentStep}
          spotlightPadding={SPOTLIGHT_PADDING}
          tooltipProgress={tooltipProgress}
          scrollProgress={isScrolling}
          text={text}
          isFirst={stepIndex === 0}
          isLast={stepIndex === steps.length - 1}
          stop={stop}
          onFinish={() => {
            if (onPress?.current) {
              onPress.current();
            }
            stop();
          }}
          next={next}
          previous={previous}
        />
      </Modal>
      <View ref={ref} style={{ flex: 1 }}>
        {children}
      </View>
    </SpotlightContext.Provider>
  );
};

export const useSpotlight = () => useContext(SpotlightContext);
