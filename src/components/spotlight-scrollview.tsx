import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useSpotlight } from "../contexts/spotlight-provider";
import React, { forwardRef, ForwardedRef } from "react";
import { ScrollViewProps } from "react-native";

type SpotlightScrollViewProps = ScrollViewProps;

export const SpotlightScrollView = forwardRef(
  (props: SpotlightScrollViewProps, ref: ForwardedRef<Animated.ScrollView>) => {
    const { scrollY } = useSpotlight();

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (e) => {
        scrollY.value = e.contentOffset.y;
      },
    });

    return (
      <Animated.ScrollView
        {...props}
        ref={ref}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      />
    );
  }
);
