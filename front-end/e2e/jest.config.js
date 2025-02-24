module.exports = {
  preset: "jest-puppeteer",
  testTimeout: 30000,
  setupFilesAfterEnv: ["expect-puppeteer"],
  testEnvironment: "node",
};
