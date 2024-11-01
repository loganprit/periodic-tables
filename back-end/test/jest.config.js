module.exports = {
  testTimeout: 30000,
  maxWorkers: 1, // Run tests serially
  verbose: true,
  testPathIgnorePatterns: ["/node_modules/"],
  rootDir: "../",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "d.ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  setupFilesAfterEnv: ["./test/jest.setup.js"],
};
