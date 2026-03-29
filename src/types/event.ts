export interface Course {
  course: string;
  dish: string;
  note: string;
}

export interface SupperEvent {
  id: string;
  slug: string;
  name: string;
  theme: string;
  event_date: string;
  event_time: string;
  location: string;
  total_seats: number;
  seats_left: number;
  price_pence: number;
  is_featured: boolean;
  menu: Course[];
  status: 'upcoming' | 'sold_out' | 'past' | 'cancelled';
}
