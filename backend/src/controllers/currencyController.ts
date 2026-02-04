/**
 * Currency Controller
 * HTTP endpoints for currency operations
 */

import { Request, Response } from 'express';
import {
  getCurrencyByCountry,
  getCurrencySymbol,
  formatPrice,
  convertCurrency,
  getExchangeRate,
  getAllExchangeRates,
  getSupportedCurrencies,
} from '../utils/currency.js';
import { createSuccessResponse, createErrorResponse } from '../utils/response.js';

/**
 * Get currency for a country
 * GET /currencies/country/:countryCode
 */
export async function getCurrencyForCountry(req: Request, res: Response): Promise<void> {
  try {
    const { countryCode } = req.params;

    if (!countryCode || countryCode.length !== 2) {
      res.status(400).json(createErrorResponse('Invalid country code. Must be 2-character ISO code.'));
      return;
    }

    const currency = getCurrencyByCountry(countryCode);
    const symbol = getCurrencySymbol(currency);

    res.json(createSuccessResponse({
      country_code: countryCode.toUpperCase(),
      currency_code: currency,
      currency_symbol: symbol
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to get currency'));
  }
}

/**
 * Get currency symbol
 * GET /currencies/:currencyCode/symbol
 */
export async function getCurrencySymbolEndpoint(req: Request, res: Response): Promise<void> {
  try {
    const { currencyCode } = req.params;

    if (!currencyCode) {
      res.status(400).json(createErrorResponse('Currency code is required'));
      return;
    }

    const symbol = getCurrencySymbol(currencyCode);

    res.json(createSuccessResponse({
      currency_code: currencyCode.toUpperCase(),
      currency_symbol: symbol
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to get currency symbol'));
  }
}

/**
 * Format price with currency
 * POST /currencies/format-price
 */
export async function formatPriceEndpoint(req: Request, res: Response): Promise<void> {
  try {
    const { amount, currency, locale } = req.body;

    if (amount === undefined || amount === null) {
      res.status(400).json(createErrorResponse('Amount is required'));
      return;
    }

    if (!currency) {
      res.status(400).json(createErrorResponse('Currency code is required'));
      return;
    }

    const formatted = formatPrice(amount, currency, locale || 'en-US');

    res.json(createSuccessResponse({
      amount,
      currency,
      formatted,
      locale: locale || 'en-US'
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to format price'));
  }
}

/**
 * Convert currency
 * POST /currencies/convert
 */
export async function convertCurrencyEndpoint(req: Request, res: Response): Promise<void> {
  try {
    const { amount, from_currency, to_currency } = req.body;

    if (amount === undefined || amount === null) {
      res.status(400).json(createErrorResponse('Amount is required'));
      return;
    }

    if (!from_currency) {
      res.status(400).json(createErrorResponse('from_currency is required'));
      return;
    }

    if (!to_currency) {
      res.status(400).json(createErrorResponse('to_currency is required'));
      return;
    }

    const convertedAmount = convertCurrency(amount, from_currency, to_currency);
    const rate = getExchangeRate(from_currency, to_currency);

    res.json(createSuccessResponse({
      original_amount: amount,
      original_currency: from_currency.toUpperCase(),
      converted_amount: Math.round(convertedAmount * 100) / 100,
      target_currency: to_currency.toUpperCase(),
      exchange_rate: Math.round(rate * 10000) / 10000
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to convert currency'));
  }
}

/**
 * Get exchange rate
 * GET /currencies/exchange-rate?from=USD&to=EUR
 */
export async function getExchangeRateEndpoint(req: Request, res: Response): Promise<void> {
  try {
    const { from, to } = req.query;

    if (!from) {
      res.status(400).json(createErrorResponse('from currency parameter is required'));
      return;
    }

    if (!to) {
      res.status(400).json(createErrorResponse('to currency parameter is required'));
      return;
    }

    const rate = getExchangeRate(from as string, to as string);

    res.json(createSuccessResponse({
      from_currency: (from as string).toUpperCase(),
      to_currency: (to as string).toUpperCase(),
      exchange_rate: Math.round(rate * 10000) / 10000
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to get exchange rate'));
  }
}

/**
 * Get all supported currencies and countries
 * GET /currencies/supported
 */
export async function getSupportedCurrenciesEndpoint(req: Request, res: Response): Promise<void> {
  try {
    const supported = getSupportedCurrencies();
    const currencyList = Object.entries(supported).map(([country, currency]) => ({
      country_code: country,
      currency_code: currency,
      currency_symbol: getCurrencySymbol(currency)
    }));

    res.json(createSuccessResponse({
      total: currencyList.length,
      currencies: currencyList
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to get supported currencies'));
  }
}

/**
 * Get all exchange rates (base: USD)
 * GET /currencies/exchange-rates
 */
export async function getAllExchangeRatesEndpoint(req: Request, res: Response): Promise<void> {
  try {
    const rates = getAllExchangeRates();

    res.json(createSuccessResponse({
      base_currency: 'USD',
      rates,
      last_updated: new Date().toISOString()
    }));
  } catch (error) {
    res.status(500).json(createErrorResponse('Failed to get exchange rates'));
  }
}
