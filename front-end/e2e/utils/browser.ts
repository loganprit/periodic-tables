import puppeteer from "puppeteer";
import type { Browser } from "puppeteer";

export async function setupBrowser(): Promise<Browser> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  
  return browser;
} 