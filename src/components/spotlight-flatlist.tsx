import { useSpotlight } from "../contexts/spotlight-provider";
import React, { forwardRef, LegacyRef } from "react";
import { FlatList, FlatListProps } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

type SpotlightFlatListProps<T> = FlatListProps<T>;

export const SpotlightFlatList = forwardRef(
  <T,>(props: SpotlightFlatListProps<T>, ref: LegacyRef<FlatList<T>>) => {
    const { scrollY, scrollX } = useSpotlight();

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (e) => {
        scrollX.value = e.contentOffset.x;
        scrollY.value = e.contentOffset.y;
      },
    });

    return (
      <Animated.FlatList
        {...props}
        //@ts-ignore next-line
        ref={ref}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      />
    );
  }
);
