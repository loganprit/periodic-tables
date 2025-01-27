import { setDefaultOptions } from "expect-puppeteer";
import fs from "fs";
import puppeteer from "puppeteer";
import type { Browser, ConsoleMessage, JSHandle, Page } from "puppeteer";

const fsPromises = fs.promises;
const baseURL = process.env["BASE_URL"] || "http://localhost:3000";

const onPageConsole = async (msg: ConsoleMessage): Promise<void> => {
  const args = await msg.args();
  const eventJson = await Promise.all(args.map((event: JSHandle) => event.jsonValue()));
  console.log(`<LOG::page console ${msg.type()}>`, ...eventJson);
};

describe("US-01 - Create and list reservations - E2E", () => {
  let page: Page;
  let browser: Browser;

  beforeAll(async () => {
    await fsPromises.mkdir("./.screenshots", { recursive: true });
    setDefaultOptions({ timeout: 1000 });
  });

  beforeEach(async () => {
    browser = await puppeteer.launch();
    const newPage = await browser.newPage();
    page = newPage as unknown as Page;
    page.on("console", onPageConsole);
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Add debug logging
    page.on("console", msg => {
      console.log(`PAGE LOG: ${msg.type()}: ${msg.text()}`);
    });

    // Navigate to the page and wait for the app to be ready
    await page.goto(`${baseURL}/reservations/new`);
    
    // Wait for React to be ready
    await page.waitForFunction(() => {
      const root = document.querySelector('#root');
      return window.hasOwnProperty('React') && 
             window.hasOwnProperty('ReactDOM') && 
             root !== null && 
             root.children.length > 0;
    }, { timeout: 10000 });
    
    // Now wait for specific elements
    try {
      await page.waitForSelector("form", { 
        timeout: 5000,
        visible: true 
      });
    } catch (error) {
      // Take a screenshot if form isn't found
      await page.screenshot({
        path: ".screenshots/form-not-found-error.png",
        fullPage: true,
      });
      throw error;
    }
  });

  afterEach(async () => {
    await browser.close();
  });

  describe("/reservations/new page", () => {
    test("filling and submitting form creates a new reservation and then displays the dashboard for the reservation date", async () => {
      const lastName = Date.now().toString(10);

      await page.type("input[name=first_name]", "James");
      await page.type("input[name=last_name]", lastName);
      await page.type("input[name=mobile_number]", "800-555-1212");
      await page.type("input[name=reservation_date]", "01012035");
      await page.type("input[name=reservation_time]", "1330");
      await page.type("input[name=people]", "2");

      await page.screenshot({
        path: ".screenshots/us-01-submit-before.png",
        fullPage: true,
      });

      await Promise.all([
        page.click("[type=submit]"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await page.screenshot({
        path: ".screenshots/us-01-submit-after.png",
        fullPage: true,
      });

      await expect(page).toMatch(lastName);
    });

    test("canceling form returns to previous page", async () => {
      // Wait for the cancel button to be present
      const cancelButton = await page.waitForSelector(
        'button[type="button"][name="cancel"]', 
        { visible: true }
      );

      if (!cancelButton) {
        throw new Error("Cancel button not found");
      }

      await page.screenshot({
        path: ".screenshots/us-01-cancel-before.png",
        fullPage: true,
      });

      await Promise.all([
        cancelButton.click(),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await page.screenshot({
        path: ".screenshots/us-01-cancel-after.png",
        fullPage: true,
      });

      expect(page.url()).toContain("/dashboard");
    });
  });
});
