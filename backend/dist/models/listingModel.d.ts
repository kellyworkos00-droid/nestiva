import { Listing } from '../types/index';
/**
 * Listing model - Database query functions
 */
/**
 * Find listing by ID
 */
export declare const findListingById: (listingId: string) => Promise<Listing | null>;
/**
 * Get all listings by host ID
 */
export declare const findListingsByHostId: (hostId: string, limit?: number, offset?: number) => Promise<{
    listings: Listing[];
    total: number;
}>;
/**
 * Create new listing
 */
export declare const createListing: (userData: {
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
    cancellation_policy: "flexible" | "moderate" | "strict" | "super_strict";
    base_price: number;
    currency: string;
    cleaning_fee: number;
    service_fee_percentage: number;
}) => Promise<Listing>;
/**
 * Update listing
 */
export declare const updateListing: (listingId: string, updates: Partial<Listing>) => Promise<Listing>;
/**
 * Publish/unpublish listing
 */
export declare const togglePublishListing: (listingId: string, isPublished: boolean) => Promise<Listing>;
/**
 * Increment view count
 */
export declare const incrementViewCount: (listingId: string) => Promise<void>;
/**
 * Search listings with filters
 */
export declare const searchListings: (filters: {
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
 * Soft delete listing
 */
export declare const softDeleteListing: (listingId: string) => Promise<void>;
//# sourceMappingURL=listingModel.d.ts.map