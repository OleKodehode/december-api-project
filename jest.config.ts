import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const defaultEsmPreset = createDefaultEsmPreset();

const config: Config = {
  ...defaultEsmPreset,
  testEnvironment: "node",
};

export default config;
