import "expect-puppeteer";
import { setDefaultOptions } from "expect-puppeteer";

setDefaultOptions({ 
  timeout: 30000
});

// Extend expect matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toMatch(pattern: string | RegExp): R;
    }
  }
}

jest.setTimeout(30000); 