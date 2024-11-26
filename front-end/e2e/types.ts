import type { Page, ElementHandle } from "puppeteer-core";

/**
 * Represents a restaurant reservation
 */
export interface Reservation {
  first_name: string;
  last_name: string;
  mobile_number: string;
  reservation_date: string;
  reservation_time: string;
  people: number;
  reservation_id?: number;
  status?: "booked" | "seated" | "finished" | "cancelled";
  created_at?: string;
  updated_at?: string;
}

/**
 * Represents a restaurant table
 */
export interface Table {
  table_name: string;
  capacity: number;
  table_id?: number;
  reservation_id?: number | null;
  status?: "free" | "occupied";
}

/**
 * API request options
 */
export interface APIOptions {
  signal?: AbortSignal;
}

/**
 * Extended Page interface with XPath selector support
 */
export interface CustomPage extends Page {
  $x(selector: string): Promise<ElementHandle[]>;
  select(selector: string, value: string): Promise<string[]>;
}

/**
 * Test configuration options
 */
export interface TestConfig {
  baseURL: string;
  apiBaseURL: string;
  timeout: number;
  viewport: {
    width: number;
    height: number;
  };
}

/**
 * API response type
 */
export interface APIResponse<T> {
  data: T;
  error?: string;
} 