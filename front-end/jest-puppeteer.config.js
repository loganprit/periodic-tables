module.exports = {
  launch: {
    headless: "new",
    slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO) : 0,
    devtools: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  browserContext: "default",
};
