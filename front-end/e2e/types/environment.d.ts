declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly BASE_URL: string;
      readonly REACT_APP_API_BASE_URL: string;
      readonly HEADLESS: "true" | "false";
      readonly SLO_MO: string;
      readonly NODE_ENV: "development" | "production" | "test";
      readonly PORT?: string;
      readonly DEBUG?: string;
    }
  }
}

export {}; 