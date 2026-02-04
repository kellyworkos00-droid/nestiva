export interface User {
  id: string;
  email: string;
  phone_number?: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  profile_picture_url?: string;
  bio?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_document_url?: string;
  user_type: 'guest' | 'host' | 'both';
  is_superhost: boolean;
  response_rate: number;
  response_time_hours?: number;
  trust_score: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Listing {
  id: string;
  host_id: string;
  title: string;
  description: string;
  category: string;
  property_type: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  house_rules: string[];
  cancellation_policy: 'flexible' | 'moderate' | 'strict' | 'super_strict';
  base_price: number;
  currency: string;
  cleaning_fee: number;
  service_fee_percentage: number;
  availability_status: 'available' | 'blocked' | 'maintenance';
  instant_book_enabled: boolean;
  is_published: boolean;
  view_count: number;
  review_count: number;
  average_rating: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Booking {
  id: string;
  listing_id: string;
  guest_id: string;
  host_id: string;
  check_in_date: Date;
  check_out_date: Date;
  number_of_guests: number;
  number_of_nights: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'dispute';
  booking_stage: 'awaiting_host' | 'awaiting_guest' | 'confirmed' | 'checked_in' | 'checked_out';
  base_price: number;
  cleaning_fee: number;
  service_fee: number;
  discount_amount: number;
  discount_code?: string;
  total_price: number;
  currency: string;
  payment_intent_id?: string;
  payment_status: 'pending' | 'completed' | 'refunded' | 'failed';
  special_requests?: string;
  guest_message?: string;
  host_response?: string;
  host_response_at?: Date;
  cancellation_reason?: string;
  cancellation_requested_by?: 'guest' | 'host' | 'admin';
  cancelled_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  review_type: 'listing' | 'host' | 'guest';
  rating: number;
  cleanliness_rating?: number;
  communication_rating?: number;
  location_rating?: number;
  accuracy_rating?: number;
  title: string;
  comment: string;
  highlights: string[];
  concerns: string[];
  photos: string[];
  ai_summary?: string;
  is_verified: boolean;
  helpful_count: number;
  response?: string;
  response_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  sub: string;
  email: string;
  user_type: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Express.Request {
  user?: User;
  token?: string;
}

export interface PaginationQuery {
  limit?: number;
  offset?: number;
}

export interface SearchQuery extends PaginationQuery {
  city?: string;
  country?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  amenities?: string[];
  property_type?: string;
  sort?: 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export interface MapSearchQuery {
  bounds: string; // south,west,north,east
  zoom: number;
  check_in?: string;
  check_out?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      total: number;
      limit: number;
      offset: number;
    };
  };
}

export interface CreateListingPayload {
  title: string;
  description: string;
  category: string;
  property_type: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  house_rules: string[];
  cancellation_policy: string;
  base_price: number;
  currency: string;
  cleaning_fee: number;
  instant_book_enabled: boolean;
}

export interface CreateBookingPayload {
  listing_id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  special_requests?: string;
  guest_message?: string;
  discount_code?: string;
}

export interface CreateReviewPayload {
  rating: number;
  cleanliness_rating?: number;
  communication_rating?: number;
  location_rating?: number;
  accuracy_rating?: number;
  title: string;
  comment: string;
  photos?: Express.Multer.File[];
}

// Message and Conversation Types
export interface Conversation {
  id: string;
  listing_id: string;
  host_id: string;
  guest_id: string;
  booking_id?: string;
  status: 'active' | 'archived' | 'blocked';
  last_message_at?: Date;
  last_message_preview?: string;
  host_archived: boolean;
  guest_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'system';
  is_read: boolean;
  read_at?: Date;
  attachments: string[];
  metadata: Record<string, any>;
  is_deleted: boolean;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ConversationSummary extends Conversation {
  listing_title: string;
  listing_photos: string[];
  host_first_name: string;
  host_last_name: string;
  host_profile_picture?: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_profile_picture?: string;
  host_unread_count: number;
  guest_unread_count: number;
}

export interface CreateConversationData {
  listingId: string;
  hostId: string;
  guestId: string;
  bookingId?: string;
}

export interface CreateMessageData {
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType?: 'text' | 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'system';
  attachments?: string[];
  metadata?: Record<string, any>;
}

// Payment Transaction Types
export interface PaymentTransaction {
  id: string;
  booking_id: string;
  listing_id: string;
  host_id: string;
  guest_id: string;
  transaction_type: 'host_commission' | 'guest_service_fee' | 'host_payout' | 'refund_to_guest' | 'refund_from_host';
  booking_total: number;
  commission_rate: number;
  commission_amount: number;
  net_amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  payment_method?: string;
  payment_provider?: string;
  payment_intent_id?: string;
  transaction_reference: string;
  payment_due_date?: Date;
  payment_completed_at?: Date;
  description?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePaymentTransactionData {
  booking_id: string;
  listing_id: string;
  host_id: string;
  guest_id: string;
  transaction_type: string;
  booking_total: number;
  commission_rate: number;
  commission_amount: number;
  net_amount: number;
  currency?: string;
  status?: string;
  payment_due_date?: Date;
  description?: string;
  metadata?: Record<string, any>;
}

