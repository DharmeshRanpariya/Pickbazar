import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSettings } from '@/framework/settings';

export function formatPrice({
  amount,
  currencyCode,
  locale,
  fractions,
}: {
  amount: number;
  currencyCode: string;
  locale: string;
  fractions: number;
}) {
  const formatCurrency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: fractions,
  });

  return formatCurrency.format(amount);
}

export function formatVariantPrice({
  amount,
  baseAmount,
  currencyCode,
  locale,
  fractions = 2,
}: {
  baseAmount: number;
  amount: number;
  currencyCode: string;
  locale: string;
  fractions: number;
}) {
  const hasDiscount = baseAmount > amount;
  const formatDiscount = new Intl.NumberFormat(locale, { style: 'percent' });
  const discount = hasDiscount
    ? formatDiscount.format((baseAmount - amount) / baseAmount)
    : null;

  const price = formatPrice({ amount, currencyCode, locale, fractions });
  const basePrice = hasDiscount
    ? formatPrice({ amount: baseAmount, currencyCode, locale, fractions })
    : null;

  return { price, basePrice, discount };
}

export default function usePrice(
  data?: {
    amount: number;
    baseAmount?: number;
    currencyCode?: string;
  } | null
) {
  const { settings } = useSettings();
  const currency = settings?.currency;
  const currencyOptions = settings?.currencyOptions;
  const { amount, baseAmount, currencyCode, currencyOptionsFormat } = {
    ...data,
    currencyCode: currency ?? 'USD',
    currencyOptionsFormat: currencyOptions ?? {
      formation: 'en-US',
      fractions: 2
    }
  };
  const { formation = 'en-US', fractions = 2 } = currencyOptionsFormat!;

  const { locale } = useRouter();
  const value = useMemo(() => {
    if (typeof amount !== 'number' || isNaN(amount) || !currencyCode) {
      console.error("Invalid amount or currencyCode", { amount, currencyCode });
      return { price: '', basePrice: null, discount: null };
    }

    const fractionalDigit = fractions ? fractions : 2;
    let currentLocale = formation ? formation : 'en';
    // if (process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG) {
    //   currentLocale = locale ? locale : 'en';
    // }

    const formattedPrice = baseAmount
      ? formatVariantPrice({
          amount,
          baseAmount,
          currencyCode,
          locale: currentLocale,
          fractions: fractionalDigit,
        })
      : formatPrice({
          amount,
          currencyCode,
          locale: currentLocale,
          fractions: fractionalDigit,
        });
    return formattedPrice;
  }, [amount, baseAmount, currencyCode, locale, settings]);

  if (typeof value === 'string') {
    return { price: value, basePrice: null, discount: null };
  }
  return value;
}
