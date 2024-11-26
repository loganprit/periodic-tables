import { DateString, TimeString } from "./utils";

export interface ReservationFormData {
  first_name: string;
  last_name: string;
  mobile_number: string;
  reservation_date: DateString;
  reservation_time: TimeString;
  people: number;
  reservation_id?: number;
  status?: string;
}

export interface FormEvent extends React.FormEvent<HTMLFormElement> {
  target: HTMLFormElement;
}

export interface InputEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

export interface ErrorResponse {
  response?: {
    data: {
      error: string;
    };
  };
} 