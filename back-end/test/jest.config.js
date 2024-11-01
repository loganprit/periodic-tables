module.exports = {
  testTimeout: 30000,
  maxWorkers: 1,
  verbose: true,
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  rootDir: "../",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "d.ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        diagnostics: {
          ignoreCodes: [1343],
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
  },
  setupFilesAfterEnv: ["./test/jest.setup.js"],
};
