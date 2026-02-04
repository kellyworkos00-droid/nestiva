import { Request, Response, NextFunction } from 'express';
/**
 * Listing Controller - Handles listing requests
 */
/**
 * Create new listing
 */
export declare const createListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get listing by ID
 */
export declare const getListing_: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get host listings
 */
export declare const getMyListings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update listing
 */
export declare const updateListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Publish listing
 */
export declare const publishListing_: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Unpublish listing
 */
export declare const unpublishListing_: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Search and filter listings
 */
export declare const searchListings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete listing
 */
export declare const deleteListing_: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get listing statistics
 */
export declare const getStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=listingController.d.ts.map