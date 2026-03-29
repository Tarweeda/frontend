export interface HireRole {
  id: string;
  display_num: string;
  role_name: string;
  description: string;
  rate: string;
  is_featured: boolean;
  sort_order: number;
}

export interface HireEnquiry {
  name: string;
  email: string;
  event_date?: string;
  location?: string;
  guest_count?: number;
  staff_needed: string[];
  notes?: string;
}
