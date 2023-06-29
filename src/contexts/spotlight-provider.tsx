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
import { Animated, Dimensions, Modal, View } from "react-native";

import { Tooltip } from "../components/tooltip";

import { Svg, Path, Rect } from "react-native-svg";

type SpotlightContext = {
  stepIndex: number | null;
  stepPosition: Animated.ValueXY;
  stepSize: Animated.ValueXY;
  isScrolling: Animated.Value;
  scrollY: Animated.Value;
  scrollX: Animated.Value;
  activeTourKey: string | null;
  next: () => void;
  previous: () => void;
  start: (tourKey: string, steps: Step[]) => void;
  text: string;
  steps: Step[];
  setText: React.Dispatch<React.SetStateAction<string>>;
  onPress: MutableRefObject<(() => void) | undefined>;
  tooltipProgress: Animated.Value;
  activeStepName: string;
  setActiveStepName: React.Dispatch<React.SetStateAction<string>>;
  ref: RefObject<View>;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const SpotlightContext = createContext({} as SpotlightContext);

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const SPOTLIGHT_PADDING = 16;

type GetSvgPathParams = {
  size: Animated.ValueXY;
  position: Animated.ValueXY;
  canvasSize: { x: number; y: number };
};

const getSvgPath = ({
  size,
  position,
  canvasSize,
}: GetSvgPathParams): string => {
  const positionX = (position.x as any)._value as number;
  const positionY = (position.y as any)._value as number;
  const sizeX = (size.x as any)._value as number;
  const sizeY = (size.y as any)._value as number;

  return `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${positionX},${positionY}H${
    positionX + sizeX
  }V${positionY + sizeY}H${positionX}V${positionY}Z`;
};

const defaultSvgPath = `M0,0H${windowWidth}V${windowHeight}H0V0ZM0,0H0V0H0V0Z`;

export const SpotlightProvider = ({ children }: { children: ReactNode }) => {
  const ref = useRef<View>(null);
  const pathRef = useRef<Path>(null);

  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [tourKey, setTourkey] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [activeStepName, setActiveStepName] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const tooltipProgress = useRef(new Animated.Value(0)).current;
  const isScrolling = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  const stepPosition = useRef(
    new Animated.ValueXY({ x: windowWidth / 2, y: 0 })
  ).current;
  const stepSize = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const onPress = useRef<(() => void) | undefined>(undefined);

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
    scrollX.setValue(0);
    scrollY.setValue(0);
    tooltipProgress.setValue(0);
    stepPosition.setValue({ x: windowWidth / 2, y: 0 });
    stepSize.setValue({ x: 0, y: 0 });
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
    Animated.timing(tooltipProgress, {
      toValue: 0,
      useNativeDriver: false,
      duration: 100,
    }).start(() => {
      if (stepIndex !== null) {
        const activeStep = steps[stepIndex];
        setActiveStepName(activeStep.name);
        setText(activeStep.text);
      }
    });
  }, [stepIndex, steps]);

  const animationListener = useCallback(() => {
    const d: string = getSvgPath({
      size: stepSize,
      position: stepPosition,
      canvasSize: { x: windowWidth, y: windowHeight },
    });

    if (pathRef.current) {
      // @ts-ignore next-line
      pathRef.current.setNativeProps({ d });
    }
  }, [stepSize, stepPosition, tooltipProgress]);

  useEffect(() => {
    const id = stepPosition.addListener(animationListener);
    return () => {
      stepPosition.removeListener(id);
    };
  }, [animationListener, stepPosition]);

  return (
    <SpotlightContext.Provider
      value={{
        stepIndex,

        tooltipProgress,
        activeStepName,
        setActiveStepName,
        activeTourKey: tourKey,
        isScrolling,
        stepPosition,
        stepSize,
        scrollY,
        scrollX,
        onPress,
        text,
        steps,
        ref,
        setText,
        next,
        previous,
        start,
      }}
    >
      <Modal transparent visible={!!tourKey}>
        <Svg style={{ flex: 1 }}>
          <AnimatedPath
            ref={pathRef}
            fillRule="evenodd"
            fill="#00000060"
            d={defaultSvgPath}
          />
        </Svg>

        <Tooltip
          stepPosition={stepPosition}
          stepSize={stepSize}
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
