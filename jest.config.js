/**@type {import("jest").Config} */

const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: { "^(\\.\/|\\..\/.*)\\.js$": "$1.ts" },
  testMatch: ["**/tests/**/*.test.ts"],
  clearMocks: true,
};

export default config;
