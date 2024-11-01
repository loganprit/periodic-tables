declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      DATABASE_URL_DEVELOPMENT: string;
      DATABASE_URL_TEST: string;
      DATABASE_URL_PREVIEW: string;
      PORT: string;
      DEBUG: string;
      LOG_LEVEL: "error" | "warn" | "info" | "debug";
      NODE_ENV: "development" | "test" | "preview" | "production";
    }
  }
}

// Need to export something for TypeScript to recognize this as a module
export {};
