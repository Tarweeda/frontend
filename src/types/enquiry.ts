export interface CateringEnquiry {
  name: string;
  email: string;
  event_type: string;
  guest_count?: number;
  event_date?: string;
  city: string;
  dietary_notes?: string;
  additional_notes?: string;
}
