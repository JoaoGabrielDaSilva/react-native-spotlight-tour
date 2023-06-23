import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useSpotlight } from "../contexts/spotlight-provider";
import React, { forwardRef, ForwardedRef } from "react";
import { FlatList, FlatListProps } from "react-native";

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

type SpotlightFlatListProps<T> = FlatListProps<T>;

export const SpotlightFlatList = forwardRef(
  <T,>(
    props: SpotlightFlatListProps<T>,
    ref: ForwardedRef<Animated.FlatList<T>>
  ) => {
    const { scrollY } = useSpotlight();

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (e) => {
        scrollY.value = e.contentOffset.y;
      },
    });

    return (
      <Animated.FlatList
        {...props}
        ref={ref}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      />
    );
  }
);
