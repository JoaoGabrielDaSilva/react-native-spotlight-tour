import React, {
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Step, StepLayout } from "../types";
import { Dimensions, Modal } from "react-native";
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
} from "@shopify/react-native-skia";

type SpotlightContext = {
  stepIndex: number | null;
  currentStep: SharedValue<StepLayout | null>;
  isScrolling: SharedValue<number>;
  scrollY: SharedValue<number>;
  activeTourKey: string | null;
  next: () => void;
  previous: () => void;
  start: (tourKey: string, steps: Step[]) => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onPress: MutableRefObject<(() => void) | undefined>;
  tooltipProgress: SharedValue<number>;
  stepX: SkiaMutableValue<number>;
  stepY: SkiaMutableValue<number>;
  stepWidth: SkiaMutableValue<number>;
  stepHeight: SkiaMutableValue<number>;
  activeStepName: string;
  setActiveStepName: React.Dispatch<React.SetStateAction<string>>;
};

const SpotlightContext = createContext({} as SpotlightContext);

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const SPOTLIGHT_PADDING = 16;

export const SpotlightProvider = ({ children }: { children: ReactNode }) => {
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [tourKey, setTourkey] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [activeStepName, setActiveStepName] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const tooltipProgress = useSharedValue(0);

  const stepX = useValue(windowWidth / 2);
  const stepY = useValue(0);
  const stepWidth = useValue(0);
  const stepHeight = useValue(0);

  const onPress = useRef<(() => void) | undefined>(undefined);

  const currentStep = useSharedValue<StepLayout | null>(null);
  const isScrolling = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const clock = useClockValue();

  const start = (tourKey: string, steps: Step[]) => {
    setTourkey(tourKey);
    setStepIndex(0);
    setSteps(steps);
  };
  const stop = () => {
    setTourkey(null);
    setStepIndex(null);
    setSteps([]);
    tooltipProgress.value = 0;
    stepX.current = windowWidth / 2;
    stepY.current = 0;
    stepWidth.current = 0;
    stepHeight.current = 0;
  };

  const next = () => {
    if (onPress?.current) {
      onPress.current();
    }
    setStepIndex((state) => (state !== null ? state + 1 : state));
  };

  const previous = () => {
    setStepIndex((state) =>
      state !== null && state - 1 >= 0 ? state - 1 : state
    );
  };

  useEffect(() => {
    if (stepIndex !== null) {
      const activeStep = steps[stepIndex];
      setActiveStepName(activeStep.name);
      setText(activeStep.text);
    }
  }, [stepIndex]);

  return (
    <SpotlightContext.Provider
      value={{
        stepIndex,
        tooltipProgress,
        activeStepName,
        setActiveStepName,
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
                <Rect
                  x={stepX}
                  y={stepY}
                  width={stepWidth}
                  height={stepHeight}
                  color="black"
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
          text={text}
          isFirst={stepIndex === 1}
          isLast={stepIndex === steps.length - 1}
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
