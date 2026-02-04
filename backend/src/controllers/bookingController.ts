import { Request, Response, NextFunction } from 'express';
import { createSuccessResponse, createErrorResponse, ApiError } from '../utils/errors';
import {
  createNewBooking,
  getBookingDetails,
  getGuestBookings,
  getHostBookings,
  getListingBookings,
  confirmBooking as confirmBookingService,
  rejectBooking as rejectBookingService,
  cancelBooking as cancelBookingService,
  checkInBooking as checkInBookingService,
  checkOutBooking as checkOutBookingService,
  getBookingStats as getBookingStatsService,
  getUpcomingBookings as getUpcomingBookingsService,
} from '../services/bookingService';

/**
 * Booking Controller - Handles booking requests
 */

/**
 * Create new booking
 */
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const guestId = (req as any).user?.userId;

    if (!guestId) {
      throw new Error('Unauthorized');
    }

    const {
      listing_id,
      check_in_date,
      check_out_date,
      number_of_guests,
      special_requests,
      guest_message,
      discount_code,
    } = req.body;

    const booking = await createNewBooking(guestId, {
      listing_id,
      check_in_date: new Date(check_in_date),
      check_out_date: new Date(check_out_date),
      number_of_guests,
      special_requests,
      guest_message,
      discount_code,
    });

    res.status(201).json(createSuccessResponse({ booking }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Get booking by ID
 */
export const getBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { bookingId } = req.params;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const booking = await getBookingDetails(bookingId, userId);

    res.status(200).json(createSuccessResponse({ booking }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Get my bookings (as guest)
 */
export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const guestId = (req as any).user?.userId;
    const { status, limit = '20', offset = '0' } = req.query;

    if (!guestId) {
      throw new Error('Unauthorized');
    }

    const result = await getGuestBookings(
      guestId,
      status as string | undefined,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(200).json(createSuccessResponse(result));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Get bookings to manage (as host)
 */
export const getHostBookingsToManage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const hostId = (req as any).user?.userId;
    const { status, limit = '20', offset = '0' } = req.query;

    if (!hostId) {
      throw new Error('Unauthorized');
    }

    const result = await getHostBookings(
      hostId,
      status as string | undefined,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(200).json(createSuccessResponse(result));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Get bookings for a specific listing
 */
export const getListingBookings_ = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const hostId = (req as any).user?.userId;
    const { listingId } = req.params;
    const { limit = '20', offset = '0' } = req.query;

    if (!hostId) {
      throw new Error('Unauthorized');
    }

    const result = await getListingBookings(
      listingId,
      hostId,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(200).json(createSuccessResponse(result));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Confirm booking (host accepts)
 */
export const confirmBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const hostId = (req as any).user?.userId;
    const { bookingId } = req.params;
    const { host_response } = req.body;

    if (!hostId) {
      throw new Error('Unauthorized');
    }

    const booking = await confirmBookingService(bookingId, hostId, host_response);

    res.status(200).json(createSuccessResponse({ booking }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Reject booking (host declines)
 */
export const rejectBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const hostId = (req as any).user?.userId;
    const { bookingId } = req.params;
    const { host_response } = req.body;

    if (!hostId) {
      throw new Error('Unauthorized');
    }

    const booking = await rejectBookingService(bookingId, hostId, host_response);

    res.status(200).json(createSuccessResponse({ booking }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { bookingId } = req.params;
    const { cancellation_reason } = req.body;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const result = await cancelBookingService(bookingId, userId, cancellation_reason);

    res.status(200).json(
      createSuccessResponse({
        booking: result.booking,
        refund_amount: result.refundAmount,
      })
    );
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Check-in booking
 */
export const checkInBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { bookingId } = req.params;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const booking = await checkInBookingService(bookingId, userId);

    res.status(200).json(createSuccessResponse({ booking }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Check-out booking
 */
export const checkOutBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { bookingId } = req.params;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const booking = await checkOutBookingService(bookingId, userId);

    res.status(200).json(createSuccessResponse({ booking }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Get booking statistics for a listing
 */
export const getListingBookingStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const hostId = (req as any).user?.userId;
    const { listingId } = req.params;

    if (!hostId) {
      throw new Error('Unauthorized');
    }

    const stats = await getBookingStatsService(listingId, hostId);

    res.status(200).json(createSuccessResponse(stats));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};

/**
 * Get upcoming bookings for host
 */
export const getUpcomingBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const hostId = (req as any).user?.userId;
    const { limit = '10' } = req.query;

    if (!hostId) {
      throw new Error('Unauthorized');
    }

    const bookings = await getUpcomingBookingsService(hostId, parseInt(limit as string));

    res.status(200).json(createSuccessResponse({ bookings }));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json(createErrorResponse(error, req.path));
    } else {
      next(error);
    }
  }
};
