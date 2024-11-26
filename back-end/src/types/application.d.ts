import { Request, Response } from "express";

/**
 * Custom Express Request interface with additional properties
 */
export interface CustomRequest extends Request {
  reservation?: ReservationData;
  table?: TableData;
}

/**
 * Custom Express Response interface with additional properties
 */
export interface CustomResponse extends Response {
  locals: {
    reservation?: ReservationData;
    table?: TableData;
    reservation_id?: number;
  };
}

/**
 * Reservation data structure
 */
export interface ReservationData {
  reservation_id?: number;
  first_name: string;
  last_name: string;
  mobile_number: string;
  reservation_date: string;
  reservation_time: string;
  people: number;
  status?: "booked" | "seated" | "finished" | "cancelled";
  created_at?: string;
  updated_at?: string;
}

/**
 * Table data structure
 */
export interface TableData {
  table_id?: number;
  table_name: string;
  capacity: number;
  reservation_id?: number;
  created_at?: string;
  updated_at?: string;
}
