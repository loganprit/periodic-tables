import { Page, ElementHandle } from "puppeteer";
import { CustomPage } from "./types";

/**
 * Selects an option from a select element by its text content
 */
async function selectOptionByText(
  page: CustomPage,
  name: string,
  optionText: string
): Promise<string[]> {
  const optionWanted = (
    await page.$x(`//*[@name = "${name}"]/option[text() = "${optionText}"]`)
  )[0];

  const optionValue = await (
    await optionWanted.getProperty("value")
  ).jsonValue() as string;

  return await page.select(`[name=${name}]`, optionValue);
}

/**
 * Checks if an element contains specific text
 */
async function containsText(
  page: Page,
  selector: string,
  expected: string
): Promise<boolean> {
  return page.evaluate(
    (selector: string, expected: string) => {
      const element = document.querySelector(selector);
      if (!element) return false;
      const text = element.textContent || "";
      return text.toLowerCase().includes(expected.toLowerCase());
    },
    selector,
    expected
  );
}

/**
 * Standard console message handler for page events
 */
const onPageConsole = (msg: any): Promise<void> =>
  Promise.all(msg.args().map((event: any) => event.jsonValue())).then((eventJson) =>
    console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
  );

export {
  containsText,
  selectOptionByText,
  onPageConsole,
};
