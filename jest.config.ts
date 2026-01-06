import "ts-node/register";
import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const defaultEsmPreset = createDefaultEsmPreset();

const config: Config = {
  ...defaultEsmPreset,
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  globalTeardown: "<rootDir>/src/utils/globalTeardown.ts",
};

export default config;
