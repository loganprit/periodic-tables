module.exports = {
  preset: "jest-puppeteer",
  testEnvironment: "jest-environment-puppeteer",
  testEnvironmentOptions: {
    resources: "usable",
  },
  testTimeout: 8000,
};
