'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'CHF';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Against USD
  label: string;
  flag: string;
}

export const CURRENCY_RATES: Record<CurrencyCode, CurrencyRate> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£)', flag: '🇬🇧' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67, label: 'AED (د.إ)', flag: '🇦🇪' },
  CHF: { code: 'CHF', symbol: 'CHF ', rate: 0.88, label: 'CHF (Fr.)', flag: '🇨🇭' },
};

export function formatDeterministicPrice(amountInUsd: number, currency: CurrencyCode = 'USD'): string {
  const currentRate = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = Math.round(amountInUsd * currentRate.rate);
  const formattedNumber = converted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (currency === 'AED') {
    return `AED ${formattedNumber}`;
  }
  if (currency === 'CHF') {
    return `CHF ${formattedNumber}`;
  }
  return `${currentRate.symbol}${formattedNumber}`;
}

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountInUsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  formatPrice: (amount) => formatDeterministicPrice(amount, 'USD'),
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('meridian_currency') as CurrencyCode;
      if (saved && CURRENCY_RATES[saved]) {
        setCurrencyState(saved);
      }
    } catch {
      // Ignore localStorage access errors in private modes
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('meridian_currency', c);
    } catch {
      // Ignore
    }
  };

  const formatPrice = (amountInUsd: number): string => {
    return formatDeterministicPrice(amountInUsd, currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
