import { useSpotlight } from "../contexts/spotlight-provider";
import React, { forwardRef, ForwardedRef, Ref } from "react";
import { ScrollViewProps } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";

type SpotlightScrollViewProps = ScrollViewProps;

export const SpotlightScrollView = forwardRef(
  (
    props: SpotlightScrollViewProps,
    ref: Ref<Animated.ScrollView> | undefined
  ) => {
    const { scrollY, scrollX } = useSpotlight();

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (e) => {
        scrollX.value = e.contentOffset.x;
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
