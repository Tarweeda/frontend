export interface CreateOrderPayload {
  items: { product_id: string; quantity: number }[];
  customer_name: string;
  customer_email: string;
  fulfilment_type: 'delivery' | 'collection';
  delivery_address?: string;
  notes?: string;
}

export interface OrderResponse {
  order_id: string;
  order_number: string;
  client_secret: string;
  total_pence: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  fulfilment_type: 'delivery' | 'collection';
  delivery_address: string | null;
  notes: string | null;
  subtotal_pence: number;
  delivery_fee_pence: number;
  total_pence: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'received' | 'preparing' | 'ready' | 'delivered' | 'collected' | 'cancelled';
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_name: string;
  unit_price_pence: number;
  quantity: number;
  line_total_pence: number;
}
