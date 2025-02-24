module.exports = {
  launch: {
    headless: (process.env.HEADLESS || "true") === "true",
    slowMo: process.env.SLO_MO || 0,
    devtools: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  },
  browserContext: "default",
  server: {
    command: "pnpm start",
    port: 3000,
    launchTimeout: 30000,
  },
};
