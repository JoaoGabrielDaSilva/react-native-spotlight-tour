import React, {
  MutableRefObject,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Step } from "../types";

import { SharedValue, useSharedValue } from "react-native-reanimated";
import { Modal, Dimensions } from "react-native";
import { Rect, Svg } from "react-native-svg";

type SpotlightContext = {
  activeTourKey: string | null;
  next: () => void;
  previous: () => void;
  stop: () => void;
  start: (tourKey: string, steps: Step[]) => void;
  text: string;
  steps: Step[];
  setText: React.Dispatch<React.SetStateAction<string>>;
  onPress: MutableRefObject<(() => void) | undefined>;
  activeStepName: string;
  setActiveStepName: React.Dispatch<React.SetStateAction<string>>;
  scrollX: SharedValue<number>;
  scrollY: SharedValue<number>;
  stepIndex: number;
};

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const SpotlightContext = createContext({} as SpotlightContext);

export const SpotlightProvider = ({ children }: { children: ReactNode }) => {
  const [activeStepName, setActiveStepName] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [text, setText] = useState("");
  const [activeTourKey, setActiveTourKey] = useState("");
  const onPress = useRef<(() => void) | undefined>(undefined);

  const scrollX = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const start = useCallback((tourKey: string, steps: Step[]) => {
    setSteps(steps);
    setActiveStepName("");
    setActiveTourKey(tourKey);
  }, []);

  const stop = useCallback(() => {
    setActiveStepName("");
    setSteps([]);
    onPress.current = undefined;
  }, []);

  const next = useCallback(() => {
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
    const activeStep = steps?.[stepIndex];
    if (activeTourKey && activeStep) {
      setActiveStepName(activeStep.name);
      setText(activeStep.text);
    }
  }, [stepIndex, steps, activeTourKey]);

  return (
    <SpotlightContext.Provider
      value={{
        activeStepName,
        scrollX,
        scrollY,
        activeTourKey,
        onPress,
        text,
        steps,
        stepIndex,
        setActiveStepName,
        stop,
        setText,
        next,
        previous,
        start,
      }}
    >
      {children}
    </SpotlightContext.Provider>
  );
};

export const useSpotlight = () => useContext(SpotlightContext);
