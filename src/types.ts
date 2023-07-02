import { LayoutRectangle } from "react-native";

export type StepLayout = LayoutRectangle;

export type Step = { name: string; text: string };

export enum StepShape {
  RECTANGLE = "RECTANGLE",
  CIRCLE = "CIRCLE",
}
