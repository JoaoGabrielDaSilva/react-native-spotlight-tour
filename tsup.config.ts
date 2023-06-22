import { defineConfig } from "tsup";
import path from "path";
import fs from "fs/promises";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "cjs",
  sourcemap: true,
  dts: true,
  external: ["react", "react-native", "react-native-svg"],
  platform: "neutral",

  async onSuccess() {
    if (process.env.NODE_ENV === "development") {
      const exampleOutputPath = path.resolve(
        "./example/node_modules/react-native-spotlight-tour-guide"
      );

      const exampleOutputNodeModulesPath = path.resolve(
        exampleOutputPath,
        "node_modules"
      );

      await Promise.all(
        ["dist/index.js", "dist/index.d.ts"].map(async (file) => {
          const outputPath = path.resolve(exampleOutputPath, file);
          await fs.copyFile(file, outputPath);
        })
      );
      await fs.rm(exampleOutputNodeModulesPath, {
        recursive: true,
        force: true,
      });
    }
  },
});
