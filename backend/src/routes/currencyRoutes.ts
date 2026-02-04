/**
 * Currency Routes
 * Public endpoints for currency operations
 */

import express from 'express';
import * as currencyController from '../controllers/currencyController.js';

const router = express.Router();

// All currency routes are public (no authentication required)

// Country to currency
router.get('/country/:countryCode', currencyController.getCurrencyForCountry);

// Currency symbol
router.get('/:currencyCode/symbol', currencyController.getCurrencySymbolEndpoint);

// Price formatting
router.post('/format-price', currencyController.formatPriceEndpoint);

// Currency conversion
router.post('/convert', currencyController.convertCurrencyEndpoint);

// Exchange rates
router.get('/exchange-rate', currencyController.getExchangeRateEndpoint);
router.get('/exchange-rates', currencyController.getAllExchangeRatesEndpoint);

// Supported currencies
router.get('/supported', currencyController.getSupportedCurrenciesEndpoint);

export default router;
