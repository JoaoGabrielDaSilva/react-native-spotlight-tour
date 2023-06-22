import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "cjs",
  sourcemap: true,
  dts: true,
  external: ["react", "react-native", "react-native-svg"],
  platform: "neutral",
});
