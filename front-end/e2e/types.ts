import { Page, ElementHandle } from "puppeteer";

export interface Reservation {
  first_name: string;
  last_name: string;
  mobile_number: string;
  reservation_date: string;
  reservation_time: string;
  people: number;
  reservation_id?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Table {
  table_name: string;
  capacity: number;
  table_id?: number;
  reservation_id?: number | null;
}

export interface APIOptions {
  signal?: AbortSignal;
}

// Extending Puppeteer's Page interface to include custom methods
export interface CustomPage extends Page {
  $x(selector: string): Promise<ElementHandle[]>;
} 