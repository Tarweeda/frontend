export interface CreateBookingPayload {
  event_id: string;
  package_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  dietary: string[];
  special_requests?: string;
}

export interface BookingResponse {
  booking_id: string;
  booking_ref: string;
  client_secret: string | null;
  total_pence: number;
  is_enquiry: boolean;
}
