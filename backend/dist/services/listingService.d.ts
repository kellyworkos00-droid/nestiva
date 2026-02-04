import { Listing } from '../types/index';
interface CreateListingPayload {
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
}
/**
 * Listing Service - Handles listing operations
 */
/**
 * Create a new listing
 */
export declare const createNewListing: (hostId: string, payload: CreateListingPayload) => Promise<Listing>;
/**
 * Get listing by ID
 */
export declare const getListing: (listingId: string, incrementView?: boolean) => Promise<Listing>;
/**
 * Get all listings by host
 */
export declare const getHostListings: (hostId: string, limit?: number, offset?: number) => Promise<{
    listings: Listing[];
    total: number;
}>;
/**
 * Update listing
 */
export declare const updateListingDetails: (listingId: string, hostId: string, updates: Partial<CreateListingPayload>) => Promise<Listing>;
/**
 * Publish listing
 */
export declare const publishListing: (listingId: string, hostId: string) => Promise<Listing>;
/**
 * Unpublish listing
 */
export declare const unpublishListing: (listingId: string, hostId: string) => Promise<Listing>;
/**
 * Search listings with filters
 */
export declare const searchAndFilterListings: (filters: {
    city?: string;
    category?: string;
    maxPrice?: number;
    minPrice?: number;
    bedrooms?: number;
    checkInDate?: Date;
    checkOutDate?: Date;
}, limit?: number, offset?: number) => Promise<{
    listings: Listing[];
    total: number;
}>;
/**
 * Delete listing (soft delete)
 */
export declare const deleteListing: (listingId: string, hostId: string) => Promise<void>;
/**
 * Get listing statistics
 */
export declare const getListingStats: (listingId: string) => Promise<{
    viewCount: number;
    reviewCount: number;
    averageRating: number;
    inquiryCount: number;
}>;
export {};
//# sourceMappingURL=listingService.d.ts.map