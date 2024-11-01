import type { Config } from "@jest/types";

/**
 * Jest configuration for TypeScript testing environment
 * @see https://jestjs.io/docs/configuration
 */
const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>/../src"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  coverageDirectory: "../coverage",
  testTimeout: 20000,
};

export default config;
