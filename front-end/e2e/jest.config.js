module.exports = {
  preset: "jest-puppeteer",
  testTimeout: 30000,
  rootDir: "../",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["<rootDir>/e2e/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/e2e/setupTests.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "./e2e/tsconfig.json",
    },
  },
};
