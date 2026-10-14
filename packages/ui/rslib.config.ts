import { fileURLToPath } from "node:url";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "esnext",
      dts: true,
    },
  ],
  plugins: [
    pluginBabel({
      babelLoaderOptions: {
        plugins: [
          fileURLToPath(
            new URL("../../scripts/babel/auto-clsx.js", import.meta.url),
          ),
        ],
      },
    }),
    pluginReact(),
  ],
  source: {
    tsconfigPath: "./tsconfig.build.json",
    entry: {
      index: "./src/index.ts",
    },
  },
  output: {
    target: "web",
    injectStyles: true,
    distPath: {
      root: "./dist",
    },
  },
});
