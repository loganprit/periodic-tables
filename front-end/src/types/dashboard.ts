import { ReactNode } from "react";

/**
 * Reservation status types
 */
export type ReservationStatus = "booked" | "seated" | "finished" | "cancelled";

/**
 * Reservation interface
 */
export interface Reservation {
  reservation_id: number;
  first_name: string;
  last_name: string;
  mobile_number: string;
  reservation_date: string;
  reservation_time: string;
  people: number;
  status: ReservationStatus;
  created_at?: string;
  updated_at?: string;
}

/**
 * Table interface
 */
export interface Table {
  table_id: number;
  table_name: string;
  capacity: number;
  reservation_id: number | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Table form data interface
 */
export interface TableFormData {
  table_name: string;
  capacity: string | number;
}

/**
 * API parameters interface
 */
export interface ApiParams {
  signal?: AbortSignal;
  [key: string]: unknown;
}

/**
 * Dashboard props interface
 */
export interface DashboardProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Date navigation handler types
 */
export type DateNavigationHandler = () => void;

/**
 * Table action handler type
 */
export type TableActionHandler = (table_id: number) => Promise<void>;

/**
 * Reservation action handler type
 */
export type ReservationActionHandler = (reservation_id: number) => Promise<void>;
